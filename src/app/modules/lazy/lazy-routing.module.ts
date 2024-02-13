import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TchComponent } from './tch/tch.component';

const routes: Routes = [
  {
    path: '',
    component: TchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyRoutingModule { }