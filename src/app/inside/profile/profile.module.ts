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

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TranslateModule } from '@ngx-translate/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    TranslateModule,

    NzGridModule,
    NzListModule,
    NzInputModule,
    NzDatePickerModule,
    NzTableModule,
    NzButtonModule
  ]
})
export class ProfileModule { }
