import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs'

import { config } from '../../config/firebase-config';
import { User } from './user.model';
import { Router } from '@angular/router';



export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered? : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private expirationTimer: any;


  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.firebase.apiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError),
    tap(res => this.handleAuthentication(res)
    ));
  }

  signIn(email: string, password: string){
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.firebase.apiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError),
    tap(res => this.handleAuthentication(res)
    ));
  }

  autoSignIn(){
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData){
      return;
    }
    const loadUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadUser.token){
      this.user.next(loadUser);
      const expirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expirationTime);
    }
  }

  signOut(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.expirationTimer){
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
  }

  autoSignOut(expirationDuration: number){
    this.expirationTimer = setTimeout(() => {
      this.signOut();
    },expirationDuration);
  }

  private handleError(errorResponse: HttpErrorResponse){
    let errorMsg = 'An Unknown error occured!';
    if(!errorResponse.error || !errorResponse.error.error){
      return throwError(errorMsg);
    }
    switch(errorResponse.error.error.message){
      case 'EMAIL_EXISTS':
        errorMsg = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMsg = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMsg = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND' || 'INVALID_PASSWORD':
        errorMsg = 'The email or password was incorrect';
        break;
      case 'USER_DISABLED':
        errorMsg = 'The user account has been disabled by an administrator';
        break;
    }
    return throwError(errorMsg);
  }

  private handleAuthentication(res: AuthResponse){
    const expirationDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
    const user = new User(res.email, res.localId, res.idToken, expirationDate)
    this.user.next(user);
    this.autoSignOut(+res.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
