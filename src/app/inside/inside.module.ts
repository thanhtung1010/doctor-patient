import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InsideComponent } from './inside.component';
import { ROUTING_DEFINED } from 'app/_share/_enum/router.enum';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerGuard } from 'app/_share/_guards/manager.guard';
import { AvatarComponent, HeaderComponent } from './_components';
import { InsideChildResolver } from './inside.resolver.service';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import SharedModule from 'app/_share/share.module';
import { HomeComponent } from './home/home.component';
import { ManagerComponent } from './manager/manager.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'app/_cores/core.module';
import { NotFoundComponent } from 'app/_share/_component';
import { AuthGuard } from 'app/_share/_guards';

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
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: ROUTING_DEFINED.MANAGER,
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
        canActivate: [ManagerGuard]
      },
      {
        path: ROUTING_DEFINED.NOTFOUND,
        component: NotFoundComponent
      },
      {
        path: "**",
        redirectTo: ROUTING_DEFINED.NOTFOUND,
        pathMatch: "full"
      }
    ],
    resolve: {
      load: InsideChildResolver,
    }
  }
]


@NgModule({
  declarations: [
    InsideComponent,
    HeaderComponent,
    AvatarComponent,
    HomeComponent,
    ManagerComponent,
    ProfileComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,

    NzDropDownModule,
    NzGridModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
  ]
})
export class InsideModule { }
