import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './manager.component';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { AccountManagerComponent, BookedManagerComponent, PostManagerComponent } from './_components';
import { ROUTING_DEFINED } from 'app/_share/_enum';
import SharedModule from 'app/_share/share.module';
import { TranslateModule } from '@ngx-translate/core';

export const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {
        path: ROUTING_DEFINED.ACCOUNT,
        component: AccountManagerComponent,
      },
      {
        path: ROUTING_DEFINED.POST,
        component: PostManagerComponent,
      },
      {
        path: ROUTING_DEFINED.BOOKED,
        component: BookedManagerComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ROUTING_DEFINED.ACCOUNT
      }
    ],
  }
]

@NgModule({
  declarations: [
    PostManagerComponent,
    AccountManagerComponent,
    BookedManagerComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    TranslateModule,

    NzMenuModule,
    NzTableModule,
    NzIconModule,
    NzPopconfirmModule,
  ]
})
export class ManagerModule { }
