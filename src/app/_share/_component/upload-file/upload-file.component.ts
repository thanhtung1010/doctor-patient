import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode } from "app/_share/_enum";
import { ShareService } from "app/_share/_services/share.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzUploadFile } from "ng-zorro-antd/upload";

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html'
})

export class UploadFileComponent implements OnInit {
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;

    @Output() emitImgUrl = new EventEmitter<string>();
    @Output() emitLoadingStt = new EventEmitter<boolean>();

    currentSelected: string = '';

    constructor(
        private msg: NzMessageService,
        private translate: TranslateService,
        private shareSer: ShareService
    ) { }

    ngOnInit(): void { }

    beforeUpload = (file: NzUploadFile) => {
        this.loading = true;
        this.emitLoadingStatus();
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
            this.loading = false;
            this.emitLoadingStatus();
        }
        return false
    }

    uploadImg(file: any) {
        const _params = new FormData();
        _params.append('file', file as (string | Blob), file.name as string)
        this.shareSer.uploadImg(_params).subscribe({
            next: (resp) => {
                if (resp.imageUrl) {
                    this.currentSelected = resp.imageUrl || '';
                } else {
                    this.currentSelected = '';
                }
                this.loading = false;
                this.emitCurrentSelectImg();
                this.emitLoadingStatus();
            },
            error: (err) => {
                console.log(err);
                this.showError('8');
                this.loading = false;
                this.emitLoadingStatus();
            },
        });
    }

    emitCurrentSelectImg() {
        this.emitImgUrl.emit(this.currentSelected);
    }

    emitLoadingStatus() {
        this.emitLoadingStt.emit(this.loading);
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }
}