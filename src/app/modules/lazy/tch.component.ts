import { Component } from '@angular/core';

@Component({
  selector: 'app-tch',
  standalone: true,
  template: `<h4>{{ title }} component!</h4>`
})
export class TchComponent {
  title = 'TCH';
}
