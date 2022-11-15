import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode, KEY_CODE_WINDOW } from "app/_share/_enum";
import { IPost } from "app/_share/_interface";
import { ShareService } from "app/_share/_services";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html'
})

export class PostComponent {
    @Input() textOnly: boolean = false;
    @Input() postInfor: IPost | null = null;
    @Input() visibleFullPostModal: boolean = false;

    @Output() oEmitvisibleFullPostModal = new EventEmitter();
    @Output() oReloadComment = new EventEmitter();
    @Output() oChangeReact = new EventEmitter();

    visibleCommentModal: boolean = false;
    interact: boolean | null = null;
    editorConfig: AngularEditorConfig = {
        editable: false,
        spellcheck: false,
        height: 'auto',
        minHeight: '300px',
        width: 'auto',
        minWidth: '0',
        translate: 'no',
        enableToolbar: false,
        showToolbar: false,
        uploadWithCredentials: false,
        sanitize: false,
    }

    // @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    //     const keyCode = event.keyCode
    //     if (keyCode === KEY_CODE_WINDOW.ESCAPE) {
    //         if (this.visibleCommentModal) {
    //             this.onTogglevisibleCommentModal(false);
    //             return
    //         }
    //         if (this.visibleFullPostModal) {
    //             this.visibleFullPostModal = false
    //         }
    //     }
    // }
    constructor(
        private translate: TranslateService,
        private shareSer: ShareService,
        private msg: NzMessageService,
    ) { }

    onToggleVisibleFullPost(visible: boolean) {
        this.visibleFullPostModal = visible;
        if (this.visibleFullPostModal) {
            this.onTogglevisibleCommentModal(false)
        }
        this.oEmitVisibleFullPostModal();
    }

    onTogglevisibleCommentModal(visible: boolean) {
        this.visibleCommentModal = visible;
    }

    oEmitVisibleFullPostModal() {
        this.oEmitvisibleFullPostModal.emit(this.visibleFullPostModal);
    }

    reloadComment() {
        if (this.postInfor) {
            this.oReloadComment.emit(this.postInfor.id);
        }
    }

    onClickInteract(evt: any, field: 'totalDislike' | 'totalLike') {
        let _interact = _.cloneDeep(this.interact);
        if (this.postInfor) {
            if (evt === this.interact) {
                this.interact = null;
            } else {
                this.interact = evt;
            }
            const _params = { interact: this.interact };
            this.shareSer.interactPost(this.postInfor.id, _params).subscribe({
                next: resp => {
                    if (this.interact === null) {
                        this.onChangeReact(field, -1);
                    } else {
                        if (_interact === null) {
                            this.onChangeReact(field, 1);
                        }
                        if (_interact === true) {
                            this.onChangeReact(field, 1);
                            this.onChangeReact('totalLike', -1);
                        }
                        if (_interact === false) {
                            this.onChangeReact(field, 1);
                            this.onChangeReact('totalDislike', -1);
                        }
                    }
                },
                error: error => {
                    console.log(error)
                    this.showError(error['error'] ? error['error'].code || 8 : 8);
                },
                complete: () => { }
            });
        } else {
            this.showError('8')
        }
    }

    onChangeReact(field: 'totalDislike' | 'totalLike', value: number) {
        this.oChangeReact.emit({ id: this.postInfor ? this.postInfor.id || null : null, field: field, value: value })
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }
}
