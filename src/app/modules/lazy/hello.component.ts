import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  template: `<h4>{{ title }} component</h4>`
})
export class HelloComponent {
  title = 'HELLO';
}