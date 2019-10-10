import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs'

import { config } from '../../config/firebase-config';
import { User } from './user.model';



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


  constructor(private http: HttpClient) { }

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
    this.user.next(new User(res.email, res.localId, res.idToken, expirationDate));
  }
}
