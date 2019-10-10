import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-icon',
  template: '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loading-icon.component.css']
})
export class LoadingIconComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
