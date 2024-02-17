/// <reference types="webpack-env" />

import { 
    Component,
    ViewContainerRef
} from '@angular/core';

import { TchComponent } from './tch.component';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'dash-root',
  template: `
    <button (click)="loadComponent()">Load local Component</button> &nbsp;
    <button (click)="loadComponent$()">Load external (pams) Component</button>
    <ng-container #container></ng-container>
  `
})
export class DashComponent {
    
  bAlternative = true;

  constructor( private viewContainerRef: ViewContainerRef ) { }

  loadComponent() {
    if (this.bAlternative) {
      this.loadComponent_(TchComponent);
    } else {
      this.loadComponent_(HelloComponent);
    }   
    this.bAlternative = !this.bAlternative;
  }

  loadComponent_(component: any) {

    this.viewContainerRef.detach();

    const componentRef = this.viewContainerRef.createComponent( component );

    this.viewContainerRef.insert(componentRef.hostView);
  }

  loadComponent$() {
    /*
    try {
      
      const path = require.context('./pams', true, /main-.*\.js$/i).keys()[0];
      console.log('Loaded external path:' + JSON.stringify(path));

      import(path).then((pams) => {
        console.log('Loaded external path:' + JSON.stringify(pams));

        const cmp = pams.AppComponent;
        console.log('Loaded external component:' + JSON.stringify(cmp));

        // detach the current component from the view container
        // So we can insert a new one (replace)
        this.viewContainerRef.detach();
        console.log('Detached current component');

        try {
          const componentRef = this.viewContainerRef.createComponent(cmp);
          this.viewContainerRef.insert(componentRef.hostView);
        } catch (error) {
          console.error('Failed to create or insert component:', error);
        }
      }).catch((error) => {
        alert('Failed to load external component:' + error);
        console.error('Failed to load external component:', error);
      });
    } catch (error) {
      console.error('Failed to require.context :', error);
    }
    */
  }
}