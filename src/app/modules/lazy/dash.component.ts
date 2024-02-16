import {
    Component,
    ViewContainerRef
} from '@angular/core';

import { TchComponent } from './tch.component';
import { HelloComponent } from './hello.component';
// import fs from 'fs-extra';
// import fs from 'fs';
// import path from 'path';

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

    // Compiler: TS2339: Property 'context' does not exist on type 'NodeRequire'
    // const path = require.context('./pams', true, /main-.*\.js$/i).keys()[0];

    // const path: string = (require as any).context('./pams', true, /main-.*\.js$/i).keys()[0];

    /*
    function resolveMainFile(dir: string, regex: RegExp) {

      const files = fs.readdirSync(dir);

      for (const file of files) {
        if (regex.test(file)) {
          return path.join(dir, file);
        }
      }
      throw new Error('File not found');
    }

    const file = resolveMainFile('./pams', /main-.*\.js$/);  
    */

    // const path:string = require.resolveWeak('./pams/main.js');

    const path = './pams/main.js';

    // @ts-ignore
    /* @vite-ignore */
    import( path ).then( ( pams ) => {

      const cmp = pams.AppComponent;
      console.log('Loaded external component:'+ JSON.stringify(cmp));

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

      alert('Failed to load external component:'+ error);
      console.error('Failed to load external component:', error);

    });
  }
}