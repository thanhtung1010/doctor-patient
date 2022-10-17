import { ModuleWithProviders, NgModule } from '@angular/core';
import { LoadingComponent } from './_component';
import { LocalStorageHelper } from './_helps';
import { AuthGuard } from './_guards';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent
  ]
})
export default class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AuthGuard
      ]
    };
  }
}
