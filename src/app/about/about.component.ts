import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <p>
      about works!
    </p>
  `,
  styles: ``
})
export class AboutComponent implements OnInit {
  constructor() { }
  
  ngOnInit() {
    console.log('AboutComponent: ngOnInit');
  }
}
