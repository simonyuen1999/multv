# How to create a Dynamic Component in Angular 

> How to create a Angular program which has a main program and it can dynamic load a **standalone component**.  That standalone component can be rebuild and replaced by different build process, but the main program does not need to rebuild and redeploy.  The main program just load the standalone component with tight up in a single build process.

You want to create an Angular program that can dynamically load a standalone component, which can be updated independently from the main program. This can be useful for scenarios where you want to have **modular and reusable components** that can be changed or replaced without affecting the rest of the application.

One possible way to achieve this is to use the **ComponentFactoryResolver** service, which can create component instances at runtime based on a given component type [1] [2]. You can use this service to load a standalone component into a **ViewContainerRef**, which is a container where one or more views can be attached [1] [3]. You can also use the **Injector** service to provide any dependencies that the standalone component may need [1] [4].

To use this approach, you need to do the following steps:

1. Create a standalone component that has the **standalone: true** flag in its decorator. This means that the component does not need to be declared in any **NgModule** and can specify its own imports [5]. For example, you can create a simple **HelloComponent** that displays a greeting message:
```js
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  template: `<h1>Hello, {{name}}!</h1>`
})
export class HelloComponent {
  name = 'World';
}
```

2. Create a main component that has a **ViewContainerRef** injected in its constructor. This will be the container where the standalone component will be loaded. You also need to inject the **ComponentFactoryResolver** and the **Injector** services, which will be used to create and inject the standalone component. For example, you can create a simple AppComponent that has a button to load the HelloComponent:

```js
import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="loadComponent()">Load Component</button>
    <ng-container #container></ng-container>
  `
})
export class AppComponent {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  loadComponent() {
    // create a component factory for the HelloComponent
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HelloComponent);

    // create a component instance using the factory and the injector
    const componentRef = componentFactory.create(this.injector);

    // attach the component to the view container
    this.container.insert(componentRef.hostView);
  }
}
```

3. Bootstrap the application using the **bootstrapApplication** function, which can bootstrap an application without any NgModule by using a standalone component as the root component 5 . For example, you can update the main.ts file with the following content:

```js
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch(err => console.error(err));
```

This way, you can create an Angular program that can dynamically load a standalone component into the main component. You can also update or replace the standalone component without rebuilding or redeploying the main component, as long as the selector and the inputs/outputs of the standalone component remain the same. You can find more information and examples on how to create and load standalone components in Angular online [1] [2] [3] [4] [5].

[1] https://angular.io/guide/standalone-components

[2] https://developer.okta.com/blog/2021/12/08/angular-dynamic-components

[3] https://www.thisdot.co/blog/how-to-create-standalone-components-in-angular

[4] https://www.fabiobiondi.dev/tutorials/angular/angular-standalone-apps

[5] https://medium.com/@aayyash/creating-a-component-dynamically-and-programmatically-in-angular-a8e1fa88e23e

## Build processes

> After we created the above **AppComponent** and **HelloComponent**, how to create two independent build process for each.

After created the AppComponent and the HelloComponent, to create two independent build processes for each component, you may need to use some additional tools and configurations. Here are some possible options:

+ You can use **ngx-build-plus**, which is an extension for the Angular CLI that allows you to build multiple projects or libraries in a single command [1]. You can also use it to create a single bundle for each component, which can be useful for web components [1] [2]. To use this tool, you need to install it with ```npm i ngx-build-plus```, update your angular.json file to point to the ngx-build-plus builder, and add some scripts to your package.json file to run the builder [1] [2].

+ You can use **Angular Elements**, which is a package that provides a simple way to create and publish Angular components as web components [3] [4]. You can use this package to create standalone components that do not need to be declared in any NgModule and can specify their own imports [4] [5]. To use this package, you need to install it with ```ng add @angular/elements```, create your custom element components with the standalone: true flag, and define them in your app.module.ts file [4] [5].

+ You can use **Angular Workspace**, which is a feature that allows you to create and manage multiple projects or libraries in a single workspace [6]. You can use this feature to create separate projects for each component and configure them independently [6]. To use this feature, you need to create a blank workspace with ```ng new angular-app --create-application=false```, generate your projects with ```ng generate application app-name```, and build them with ```ng build app-name``` [6].

These are some of the common ways to create two independent build processes for Angular components. 

[1] https://stackoverflow.com/questions/55783925/generate-seperate-build-file-for-a-particular-component-in-angular-7

[2] https://stackoverflow.com/questions/56884697/angular-build-process-with-multiple-projects-and-libraries

[3] https://stackoverflow.com/questions/39624749/how-to-build-multiple-applications-with-angular-cli

[4] https://trailheadtechnology.com/create-and-compile-web-components-in-angular-projects/

[5] https://stackoverflow.com/questions/51185021/is-it-possible-to-generate-multiple-angular-components-using-single-angular-cli

[6] No longer exists.

## Deployment

> After we created the above **AppComponent** and **HelloComponent**, how to deploy them to a server.

> Once two build processes are created and generated their bundles, explain how to deploy them.  The AppComponent first, and then HelloComponent.   Later modify the HelloComponent and rebuild it.  Then, just redeploy the HelloComponent and do not touch the existing AppComponent.

To deploy your Angular bundles, you need to have a web server that can host your static files and serve them to the browser. You can use any web server of your choice, such as Apache, Nginx, or Firebase. Here are the general steps to deploy your bundles:

1. Build your AppComponent and HelloComponent projects using the ```ng build``` command. This will create a dist folder for each project, containing the bundled files and assets.

2. Copy the ```dist``` folder of the AppComponent project to the web server’s root directory. This will make the ```AppComponent``` accessible from the web server’s base URL, such as ```http://example.com/```.

3. Copy the ```dist``` folder of the HelloComponent project to a subdirectory of the web server’s root directory, such as hello. This will make the ```HelloComponent``` accessible from a sub-URL, such as ```http://example.com/hello/```.

4. In the AppComponent project, modify the ```loadComponent()``` method to use the sub-URL of the HelloComponent project as the source of the component factory. For example, you can write:

```js
loadComponent() {
  // create a component factory from the HelloComponent URL
  const componentFactory = this.componentFactoryResolver.resolveComponentFactoryFromUrl('http://example.com/hello/main.js');

  // create a component instance using the factory and the injector
  const componentRef = componentFactory.create(this.injector);

  // attach the component to the view container
  this.container.insert(componentRef.hostView);
}
```

5. Rebuild the AppComponent project and copy the updated ```dist``` folder to the web server’s root directory, replacing the previous one.

6. Test your application by opening the web server’s base URL in the browser. You should see a button to load the HelloComponent, which will be fetched from the sub-URL and displayed in the AppComponent.

If you want to modify the HelloComponent and redeploy it, you can do the following steps:

1. Make the changes you want in the HelloComponent project and rebuild it using the ```ng build``` command. This will update the ```dist``` folder of the HelloComponent project with the new bundled files and assets.

2. Copy the updated dist folder of the HelloComponent project to the web server’s subdirectory, replacing the previous one.

3. Test your application by opening the web server’s base URL in the browser. You should see the updated HelloComponent when you load it in the AppComponent.

You do not need to touch the existing AppComponent when you redeploy the HelloComponent, as long as the selector and the inputs/outputs of the HelloComponent remain the same. The AppComponent will dynamically load the latest version of the HelloComponent from the sub-URL.

## ComponentFactoryResolver is deprecated after Angular 13

Before Angular 13, the **ComponentFactoryResolver** class was used to create a component factory from a component URL. This class is now deprecated and will be removed in Angular 14.    Here is the example to move to new **createComponent** API.

```js
// app.component.ts
// Use componentFactoryResolver to create component factory
import {
  Component,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ElementRef,
} from '@angular/core';
import { ProfileAComponent } from './profile-a/profile-a.component';
import { ProfileBComponent } from './profile-b/profile-b.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private el: ElementRef
  ) {}

  loadProfileA() {
    this.loadComponent(ProfileAComponent);
  }

  loadProfileB() {
    this.loadComponent(ProfileBComponent);
  }

  private loadComponent(component: any) {
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    this.el.nativeElement.appendChild(componentRef.location.nativeElement);

    componentRef.onDestroy(() => {
      this.appRef.detachView(componentRef.hostView);
    });
  }
}
```
Change to the new API:
```js
// app.component.ts
// Use createComponent to create component factory
import {
  Component,
//ComponentFactoryResolver,    
//Injector,
  ApplicationRef,
  ElementRef,
  ViewContainerRef,            // <-- New
} from '@angular/core';
import { ProfileAComponent } from './profile-a/profile-a.component';
import { ProfileBComponent } from './profile-b/profile-b.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
//  private componentFactoryResolver: ComponentFactoryResolver,
//  private injector: Injector,
    private appRef: ApplicationRef,
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef     // <-- New
  ) {}

  loadProfileA() {
    this.loadComponent(ProfileAComponent);
  }

  loadProfileB() {
    this.loadComponent(ProfileBComponent);
  }

  private loadComponent(component: any) {

    // Remove this
    // const factory =
    //   this.componentFactoryResolver.resolveComponentFactory(component);
    // const componentRef = factory.create(this.injector);

    // New API call
    const componentRef = this.viewContainerRef.createComponent(component);

    this.appRef.attachView(componentRef.hostView);
    this.el.nativeElement.appendChild(componentRef.location.nativeElement);

    componentRef.onDestroy(() => {
      this.appRef.detachView(componentRef.hostView);
    });
  }
}
```

## Other topics
A simple Standalone Component https://www.fabiobiondi.dev/tutorials/angular/angular-standalone-apps--

1. ```standalone: true```  This is a Standalone component or app.

2. **AsyncPipe** is a pipe that can be used to unwrap a value from an **Observable** or **Promise** and display it in the template. It subscribes to the **asynchronous** source and returns the latest value it has emitted. It also marks the component to be checked for changes when **a new value is emitted**, and **unsubscribes automatically when the component is destroyed**.  AsyncPipe is part of the ```@angular/common``` package, which provides common directives and pipes for Angular applications.

3. Angular **HttpClient** is a service that provides a simplified API for HTTP **requests** and **responses** in Angular applications. It supports common HTTP methods, such as **GET, POST, PUT, DELETE**, etc., and allows you to send and receive data in various formats, such as **JSON, text, blob**, etc.  It also provides features such as **interceptors, progress events, typed responses, error handling**, and testing.

4. **HttpClientModule** is a module that configures the **dependency injector for HttpClient** with supporting services, such as **XSRF protection, interceptors, and JSONP**. It is automatically imported by the ```@angular/common/http``` package, which provides the HttpClient service and related classes.

    - To use **HttpClient** in a standalone component, you need to include HttpClientModule in the component’s imports array, because it provides the necessary providers and dependencies for HttpClient. However, you also need to import HttpClient at the beginning of the component’s file, because it is the class that you need to inject in the component’s constructor to create an instance of the service.

```js
import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <li *ngFor="let user of users$ | async">{{user.name}}</li>
  `,
  imports: [
    HttpClientModule, // <==
    NgFor,
    AsyncPipe
  ],
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  users$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
}
```
If you prefer to import it in ```main.ts``` by using the **provideHttpClient** function as shown below in order to make all the **HttpClient** features globally avaiable.
```js
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideHttpClient } from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // <==
  ]
})
.catch(err => console.log(err))
```
### Another minor point in the dynamic component loading
Normally in ```route.js``` 
```js
providers: [
  provideHttpClient(),
  provideRouter([
    {path: 'home', loadComponent: () =>
           import('./app/pages/home.component').then(c => c.HomeComponent)},
    {path: 'catalog', loadComponent: () =>
           import('./app/pages/catalog.component').then(c => c.CatalogComponent)},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
  ])
]  
```
Add ```default``` keyword in component file
```js
export default class HomeComponent { }
...
export default class CatalogComponent { }
```
Then, the above code can be changed as follows,
```js
providers: [
  provideHttpClient(),
  provideRouter([
    {path: 'home', loadComponent: () => import('./app/pages/home.component')},
    {path: 'catalog', loadComponent: () => import('./app/pages/catalog.component')},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
  ])
]
```
## Stardalone Component
Getting started with standalone components 
https://angular.io/guide/standalone-components

Standalone components can also be imported into existing **NgModules-based** contexts. This allows existing applications (which are using NgModules today) to incrementally adopt the new, standalone style of component.

You can import a standalone component (or directive, or pipe) just like you would an ```NgModule``` - using ```NgModule.imports```:
```js
@NgModule({
  declarations: [AlbumComponent],
  exports: [AlbumComponent], 
  imports: [PhotoGalleryComponent],    // <==
})
export class AlbumModule {}
```

# Appendix

- https://angular.io/guide/migration-component-factory-resolver

- https://garage.sekrab.com/posts/creating-a-component-dynamically-and-programmatically-in-angular

- **Fabio Bionda** tutorial site (nice presentation)
   - https://www.fabiobiondi.dev/tutorials

- ***Create and Compile Web Components in Angular Projects***
Another artical to use webpack bilder to separate the web components to a separate project.
  - ***Note*** Our previous webpack build was not successful
  - https://trailheadtechnology.com/create-and-compile-web-components-in-angular-projects/

- ***Loading Components Dynamically in an Angular App*** :
Create a set of component and service files that will be used to load components dynamically.
  - https://developer.okta.com/blog/2021/12/08/angular-dynamic-components
  - https://github.com/oktadev/okta-angular-dynamic-components-example.git

