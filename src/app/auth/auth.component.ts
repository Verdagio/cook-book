import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService, AuthResponse } from './auth.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  registerNew: boolean = false;
  isLoading: boolean = false;
  error: string = null;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode(){
    this.registerNew = !this.registerNew;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    let authObservable: Observable<AuthResponse>;

    authObservable = (this.registerNew) ? this.authService.signUp(email, password) : this.authService.signIn(email, password);

    authObservable.subscribe( res => {
      console.log(res);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, err => {
      console.log(err);
      this.error = err;
      this.isLoading = false;
    });

    form.reset();
  }
}
