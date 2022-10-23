import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  LoadingComponent,
  ErrorComponent
} from './_component';
import { AuthGuard, ManagerGuard } from './_guards';
import { CommonModule } from '@angular/common';
import {
  NumberOnlyDirective
} from './_directives';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    LoadingComponent,
    ErrorComponent,

    NumberOnlyDirective
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    LoadingComponent,
    ErrorComponent,

    NumberOnlyDirective
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
