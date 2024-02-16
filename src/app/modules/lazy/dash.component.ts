import {
    Component,
    ViewContainerRef
} from '@angular/core';

import { TchComponent } from './tch.component';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'dash-root',
  template: `
    <button (click)="loadComponent()">Load Component</button>
    <ng-container #container></ng-container>
  `
})
export class DashComponent {
    
  bAlternative = true;

  constructor( private viewContainerRef: ViewContainerRef ) { }

  loadComponent() {
    if (this.bAlternative) {
      this.loadComponent$(TchComponent);
    } else {
      this.loadComponent$(HelloComponent);
    }   
    this.bAlternative = !this.bAlternative;
  }

  loadComponent$(component: any) {

    this.viewContainerRef.detach();

    const componentRef = this.viewContainerRef.createComponent( component );

    this.viewContainerRef.insert(componentRef.hostView);
  }
}