import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <p>
      home component works!
    </p>
  `,
  styles: ``
})
export class HomeComponent implements OnInit {
  constructor() { }
  
  ngOnInit() {
    console.log('HomeComponent: ngOnInit');
  }
}
