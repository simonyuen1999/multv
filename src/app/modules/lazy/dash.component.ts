import {
    Component,
    ComponentFactoryResolver,
    Injector,
    ApplicationRef,
    ElementRef,
    ViewChild,
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

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private el: ElementRef
  ) {}

  loadComponent() {
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

    // Alternative way: attach the component to the view container
    // this.container.insert(componentRef.hostView);

    this.appRef.attachView(componentRef.hostView);
    this.el.nativeElement.appendChild(componentRef.location.nativeElement);

    componentRef.onDestroy(() => {
      console.log('componentRef.onDestroy()');
      this.appRef.detachView(componentRef.hostView);
    });
  }
}