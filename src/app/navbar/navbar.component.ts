import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStoreService } from '../shared/data-store.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSubscription: Subscription;

  constructor(private dataStoreService: DataStoreService, private authService: AuthService) {}

  ngOnInit(){
    this.userSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  onSaveData() {
    this.dataStoreService.storeRecipes();
  }

  onFetchData(){
    this.dataStoreService.fetchRecipes().subscribe();
  }

}
