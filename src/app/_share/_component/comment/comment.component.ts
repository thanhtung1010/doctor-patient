import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Params, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { TranslateService } from "@ngx-translate/core";
import { Helpers } from "app/_cores/_helpers/helpers";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROUTING_DEFINED } from "app/_share/_enum/router.enum";
import { IComment } from "app/_share/_interface/comment.interface";
import { SessionService } from "app/_share/_services";
import { environment } from "environments/environment";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html'
})

export class CommentComponent implements OnChanges {
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
        private _router: Router,
        private sesionSer: SessionService,
    ) {
        this.defautlFormat = environment.FORMAT_SETTING
        if (this.defautlFormat) {
            this._dateFormatForShow = this.defautlFormat.dateTime;
            this.dateFormatForEdit = this._dateFormatForShow ? this._dateFormatForShow.replace('DD', 'dd').replace('YYYY', 'yyyy') : '';
        }
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

    goToProfile(id: number) {
        if (id === this.sesionSer.getID()) {
            this.goToURL(ROUTING_DEFINED.PROFILE);
        } else {
            this.goToURL(Helpers.JoinPaths([ROUTING_DEFINED.HOME, id.toString()]));
        }
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('SYS_MSG.SUCCESS'));
    }

    goToURL(url: string, param?: Params) {
        if (url) {
            if (param) {
                this._router.navigate([url], { queryParams: param });
            }
            else {
                this._router.navigate([url]);
            }
        }

    }
}