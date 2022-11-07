import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  LoadingComponent,
  ErrorComponent,
  WriteContentComponent,
  UploadFileComponent,
  StepComponent,
  BookingComponent,
  ShiftListComponent,
  NotFoundComponent,
} from './_component';
import { AuthGuard, ManagerGuard } from './_guards';
import { CommonModule } from '@angular/common';
import {
  NumberOnlyDirective
} from './_directives';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  HtmlEditorService,
  ToolbarService,
  LinkService,
  ImageService,
  RichTextEditorModule,
} from '@syncfusion/ej2-angular-richtexteditor';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputModule } from 'ng-zorro-antd/input';

import { DateTimeLabelPipe } from './_pipes';



@NgModule({
  declarations: [
    LoadingComponent,
    ErrorComponent,
    WriteContentComponent,
    UploadFileComponent,
    StepComponent,
    BookingComponent,
    ShiftListComponent,
    NotFoundComponent,

    NumberOnlyDirective,

    DateTimeLabelPipe,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,

    NzUploadModule,
    NzIconModule,
    RichTextEditorModule,
    NzStepsModule,
    NzButtonModule,
    NzModalModule,
    NzDropDownModule,
    NzSelectModule,
    NzGridModule,
    NzDatePickerModule,
    NzEmptyModule,
    NzPopconfirmModule,
    NzInputModule,
  ],
  exports: [
    LoadingComponent,
    ErrorComponent,
    WriteContentComponent,
    UploadFileComponent,
    StepComponent,
    BookingComponent,
    NotFoundComponent,

    NumberOnlyDirective,

    DateTimeLabelPipe,
  ],
  providers: [
    NzMessageService,
    HtmlEditorService,
    ToolbarService,
    LinkService,
    ImageService,

    DateTimeLabelPipe,
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
