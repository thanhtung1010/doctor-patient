import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  LoadingComponent,
  ErrorComponent,
  WriteContentComponent,
  UploadFileComponent
} from './_component';
import { AuthGuard, ManagerGuard } from './_guards';
import { CommonModule } from '@angular/common';
import {
  NumberOnlyDirective
} from './_directives';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';



@NgModule({
  declarations: [
    LoadingComponent,
    ErrorComponent,
    WriteContentComponent,
    UploadFileComponent,

    NumberOnlyDirective
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,

    NzUploadModule,
    NzIconModule,
  ],
  exports: [
    LoadingComponent,
    ErrorComponent,
    WriteContentComponent,
    UploadFileComponent,

    NumberOnlyDirective
  ],
  providers: [
    NzMessageService
  ]
})
export default class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AuthGuard,
        ManagerGuard
      ]
    };
  }
}
