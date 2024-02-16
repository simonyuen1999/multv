import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './dash.component';

const routes: Routes = [
  {
    // When app router routes to 'lazy' module without sub-path,
    // The following lazy routing will load DashComponent
    // DashComponent uses ComponentFactoryResolver to load TchComponent.
    path: '', component: DashComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyRoutingModule { }