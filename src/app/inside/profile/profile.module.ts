import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import {
  UserProfileComponent,
  YourBookedCalendarComponent
} from './_components';
import { ROUTING_DEFINED } from 'app/_share/_enum';
import SharedModule from 'app/_share/share.module';

export const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: UserProfileComponent
      },
      {
        path: ROUTING_DEFINED.YOUR_BOOKED_CALENDAR,
        component: YourBookedCalendarComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      },
    ]
  }
]

@NgModule({
  declarations: [
    UserProfileComponent,
    YourBookedCalendarComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
  ]
})
export class ProfileModule { }
