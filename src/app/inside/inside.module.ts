import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InsideComponent } from './inside.component';
import { ROUTING_DEFINED } from 'app/_share/_enum/router';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerGuard } from 'app/_share/_guards/manager.guard';
import { HeaderComponent } from './_components';

export const routes: Routes = [
  {
    path: '',
    component: InsideComponent,
    children: [
      {
        path: '',
        redirectTo: ROUTING_DEFINED.HOME,
        pathMatch: 'full'
      },
      {
        path: ROUTING_DEFINED.HOME,
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: ROUTING_DEFINED.PROFILE,
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: ROUTING_DEFINED.MANAGER,
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
        canActivate: [ManagerGuard]
      },
    ]
  }
]


@NgModule({
  declarations: [
    InsideComponent,
    HeaderComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    CommonModule,
  ]
})
export class InsideModule { }
