import { Component, Input, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode } from "app/_share/_enum";
import { ShareService } from "app/_share/_services/share.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzUploadFile } from "ng-zorro-antd/upload";
import { delay, Observable, Observer } from "rxjs";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html'
})

export class UploadFileComponent implements OnInit {
    @Input() disabled: boolean = false;

    valueSelected: any = null;
    loading: boolean = false;

    constructor(
        private msg: NzMessageService,
        private translate: TranslateService,
        private shareSer: ShareService
    ) { }

    ngOnInit(): void { }

    beforeUpload = (file: NzUploadFile) => {
        if (file) {
            if (file.type !== 'image/jpeg') {
                this.showError('15');
            }

            if (file.size! / 1024 / 1024 >= 2) {
                this.showError('16');
            }

            this.uploadImg(file);
        } else {
            this.showError('8');
        }
        return false
    }

    uploadImg(file: any) {
        const _params = new FormData();
        _params.append('file', file as (string | Blob), file.name as string)
        this.shareSer.uploadImg(_params).subscribe({
            next(resp) {
                console.log(resp)
            },
            error(err) {
                console.log(err)
            },
        });
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }
}