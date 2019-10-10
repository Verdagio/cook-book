import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler ){
    return this.authService.user.pipe(
      take(1),
      exhaustMap( user => {
        return (!user) ?
        next.handle(req) :
        next.handle(req.clone({
          params: new HttpParams().set('auth', user.token)
        }));
      }));
  }
}
