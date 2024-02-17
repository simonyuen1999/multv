import {
    Component,
    ComponentFactoryResolver,
    Injector,
    ApplicationRef,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
// import { NgForOf } from '@angular/common';

import { TchComponent } from './tch.component';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'dash-root',
  template: `
    <button (click)="loadComponent()">Load Component</button> &nbsp; &nbsp;
    <select id='sSelect' name='sSelect' (change)="loadComponent()">
      <option value="container">container</option>
      <option value="viewContainerRef">viewContainerRef</option>
      <option value="appRef">appRef</option>
    </select>
    <ng-container #container></ng-container>
  `,
})

export class DashComponent {
    
  bAlternative = true;
  sSelect:string = 'container';

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  loadComponent() {
    const sel = document.getElementById('sSelect') as HTMLSelectElement;
    this.sSelect = sel.options[sel.selectedIndex].value;
    console.log('--------------------------'+ this.sSelect +'--------------------------------');

    if (this.bAlternative) {
      this.loadComponent$(TchComponent);
    } else {
      this.loadComponent$(HelloComponent);
    }   
    this.bAlternative = !this.bAlternative;
  }

  loadComponent$(component: any) {

    // create a component factory for the HelloComponent
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory( component );

    // create a component instance using the factory and the injector
    const componentRef = componentFactory.create(this.injector);
  
    const nContainer = this.container.length;
    const nViewContainerRef = this.viewContainerRef.length;
    const nAppRef = this.appRef.components.length;
    const nAppRefview = this.appRef.viewCount

    console.log('nContainer: ' + nContainer + ', nViewContainerRef: ' + nViewContainerRef + ', nAppRef: ' + nAppRef + ', nAppRefview: ' + nAppRefview);

    // ------------------------------------------------------------
    if ( this.sSelect === 'container' ) {

      console.log( 'container.insert(componentRef.hostView)');

      if (this.container.length > 0) {
        console.log('container.length > 0, the container.clear()');  
        this.container.clear();
      } 
      this.container.insert(componentRef.hostView);

    // ------------------------------------------------------------
   
    } else if ( this.sSelect === 'viewContainerRef' ) {

      console.log( 'viewContainerRef.insert(componentRef.hostView)');

      if (this.viewContainerRef.length > 0) {  
        console.log('viewContainerRef.length > 0, the viewContainerRef.clear()');
        this.viewContainerRef.clear();
      }
      this.viewContainerRef.insert(componentRef.hostView);

    // ------------------------------------------------------------
   
    } else if ( this.sSelect === 'appRef' ) {

      console.log( 'appRef.attachView(componentRef.hostView) and el.nativeElement.appendChild(componentRef.location.nativeElement)');

      if (this.appRef.viewCount > 0) { 
        console.log('appRef.viewCount > 0, the appRef.detachView()');
        this.appRef.detachView(componentRef.hostView);
      }

      this.appRef.attachView(componentRef.hostView);
      this.el.nativeElement.appendChild(componentRef.location.nativeElement);
    }

    componentRef.onDestroy(() => {
      console.log('componentRef.onDestroy()');
    });
  }
}