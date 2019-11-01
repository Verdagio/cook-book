import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponse } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { DynamicViewDirective } from '../shared/dynamic-view.directive';






@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  private closeSub: Subscription;
  @ViewChild(DynamicViewDirective) alertHost: DynamicViewDirective;
  registerNew: boolean = false;
  isLoading: boolean = false;
  error: string = null;


  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }

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
      this.showErrorAlert(err);
      this.isLoading = false;
    });

    form.reset();
  }
  onHandleError(){
    this.error = null;
  }

  private showErrorAlert(e: string){
    const alertCompFact = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const viewContRef = this.alertHost.viewContainerRef;

    viewContRef.clear();
    const componentRef = viewContRef.createComponent(alertCompFact);
    componentRef.instance.message = e;
    this.closeSub = componentRef.instance.close.subscribe(
      () => {
        this.closeSub.unsubscribe();
        viewContRef.clear();
      }
    )
  }
}
