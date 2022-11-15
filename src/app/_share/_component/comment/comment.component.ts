import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { IComment } from "app/_share/_interface/comment.interface";
import { environment } from "environments/environment";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html'
})

export class CommentComponent implements OnInit, OnChanges {
    @Input() commentInfor: IComment | null = null;
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';
    avatarText: string = '';
    editorConfig: AngularEditorConfig = {
        editable: false,
        spellcheck: false,
        height: 'auto',
        minHeight: '100px',
        width: 'auto',
        minWidth: '0',
        translate: 'no',
        showToolbar: false,
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['strikeThrough', 'subscript', 'superscript'],
            ['indent', 'outdent'],
            ['insertUnorderedList', 'insertOrderedList'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',],
            ['heading', 'fontName', 'fontSize'],
            ['textColor', 'backgroundColor', 'customClasses'],
            ['insertHorizontalRule', 'insertVideo'],
            ['toggleEditorMode'],
        ],
    }

    constructor(
        private translate: TranslateService,
        private msg: NzMessageService,
    ) {
        this.defautlFormat = environment.FORMAT_SETTING
        if (this.defautlFormat) {
            this._dateFormatForShow = this.defautlFormat.date;
            this.dateFormatForEdit = this._dateFormatForShow ? this._dateFormatForShow.replace('DD', 'dd').replace('YYYY', 'yyyy') : '';
        }
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['commentInfor'] && changes['commentInfor'].currentValue && _.size(changes['commentInfor'])) {
            this.avatarText = this.getTextAvatar();
        }
    }

    getTextAvatar(): string {
        if (this.commentInfor) {
            for (let i = 0; i < this.commentInfor.createdBy.length; i++) {
                if (this.commentInfor.createdBy[i].trim()) {
                    return this.commentInfor.createdBy[i].toUpperCase();
                }
            }
        }
        return ''
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }
}