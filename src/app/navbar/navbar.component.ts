import { Component } from '@angular/core';
import { DataStoreService } from '../shared/data-store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private dataStoreService: DataStoreService) {}

  onSaveData() {
    this.dataStoreService.storeRecipes();
  }

  onFetchData(){
    this.dataStoreService.fetchRecipes().subscribe();
  }

}
