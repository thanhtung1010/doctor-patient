import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent, UserProfileComponent } from './_components';
import SharedModule from 'app/_share/share.module';
import { TranslateModule } from '@ngx-translate/core';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: ':id',
        component: UserProfileComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    HomePageComponent,
    UserProfileComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    TranslateModule,

    NzGridModule,
    NzIconModule,
    NzListModule,
  ]
})
export class HomeModule { }
