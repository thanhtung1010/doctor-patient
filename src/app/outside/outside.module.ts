import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './_component';
import { ShareModule } from '../_share/share.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/authentication' },
  {
    path: 'authentication',
    component: AuthenticationComponent
  },
];


@NgModule({
  declarations: [
    AuthenticationComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ShareModule
  ],
  exports: [ ],
})
export class OutsideModule { }
