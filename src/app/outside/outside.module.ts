import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './_component';
import { RouterModule, Routes } from '@angular/router';
import SharedModule from 'app/_share/share.module';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'app/_cores/core.module';
import { LoginService } from './_service/login.service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: "full"
  }
];


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,

    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzRadioModule,

    CoreModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [],
  providers: [
  ]
})
export class OutsideModule { }
