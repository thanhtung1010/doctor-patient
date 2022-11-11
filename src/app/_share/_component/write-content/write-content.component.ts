import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularEditorConfig, } from "@kolkov/angular-editor";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { SessionService, ShareService } from "app/_share/_services";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";
import { tap } from "rxjs";

@Component({
    selector: 'app-write-content',
    templateUrl: './write-content.component.html'
})

export class WriteContentComponent implements OnInit, OnChanges {
    @Input() inputEditorConfig: AngularEditorConfig | null = null;

    @Output() onSubmitPostSuccess = new EventEmitter();

    avatarText: string = '';
    formPost: FormGroup | null = null;
    allowCreatePost: boolean = false;
    visibleCreatePostModal: boolean = false
    data = {
        threads: [] as { id: number, name: string }[]
    }
    loading = {
        thread: false,
        post: false,
        uploadImage: false
    }
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: false,
        height: '300px',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'no',
        enableToolbar: true,
        showToolbar: true,
        placeholder: this.translate.instant('COMMON.ENTER_YOUR_CONTENT'),
        // defaultParagraphSeparator: '',
        // defaultFontName: 'Times New Roman',
        // defaultFontSize: '2',
        // fonts: [
        //     { class: 'arial', name: 'Arial' },
        //     { class: 'times-new-roman', name: 'Times New Roman' },
        //     { class: 'calibri', name: 'Calibri' },
        //     { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        // ],
        // customClasses: [
        //     {
        //         name: 'quote',
        //         class: 'quote',
        //     },
        //     {
        //         name: 'redText',
        //         class: 'redText'
        //     },
        //     {
        //         name: 'titleText',
        //         class: 'titleText',
        //         tag: 'h1',
        //     },
        // ],
        uploadUrl: 'https://med-service-demo.herokuapp.com/api/upload',
        upload: (file: File) => {
            return this.beforeUpload(file)
        },
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
        private fb: FormBuilder,
        private translate: TranslateService,
        private shareSer: ShareService,
        private msg: NzMessageService,
        private sessionSer: SessionService,
    ) {
        this.allowCreatePost = this.sessionSer.isLogged() && (this.sessionSer.isDoctor() || this.sessionSer.isAdmin());
        this.avatarText = this.sessionSer.getTextAvatar();
    }

    ngOnInit(): void {
        if (!this.formPost) {
            this.formPost = this.fb.group({
                title: [null, Validators.required],
                threadId: [null, Validators.required],
                content: ['', Validators.required],
            })
        }
        this.initData()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inputEditorConfig'] && changes['inputEditorConfig'].currentValue && _.size(changes['inputEditorConfig'].currentValue)) {
            this.editorConfig = {
                ...this.editorConfig,
                ...this.inputEditorConfig
            }
        }
    }

    initData() {
        this.getThread();
    }

    getThread() {
        this.loading.thread = true;
        this.shareSer.getThread().subscribe({
            next: resp => {
                if (resp.data && resp.data.length) {
                    this.data.threads = resp.data
                } else {
                    this.data.threads = []
                }
                this.loading.thread = false;
            },
            error: error => {
                this.loading.thread = false;
            },
            complete: () => {
                this.loading.thread = false;
            }
        });
    }

    beforeUpload(file: File) {
        this.loading.uploadImage = true;
        if (!file) {
            this.showError('8');
            this.loading.uploadImage = false;
            return undefined
        }

        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            this.showError('15');
            this.loading.uploadImage = false;
            return undefined
        }

        if (file.size! / 1024 / 1024 >= 2) {
            this.showError('16');
            this.loading.uploadImage = false;
            return undefined
        }

        const _timeOutUploadImage = setTimeout(() => {
            this.loading.uploadImage = false
            clearTimeout(_timeOutUploadImage);
        }, 1000);
        return this.uploadImg(file);
    }

    uploadImg(file: any) {
        const _params = new FormData();
        _params.append('file', file as (string | Blob), file.name as string)
        const _response = this.shareSer.uploadImgWithHTTPRequest(_params);
        return _response as any
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }

    onSubmit() {
        if (this.formPost && this.formPost.valid) {
            this.loading.post = true;
            const _params = this.formPost.value;
            this.shareSer.createPost(_params).subscribe({
                next: resp => {
                    if (resp) {
                        this.showSuccess();
                        this.loading.post = false;
                        this.formPost = null;
                        this.notiSubmitPostSuccess();
                        this.onToggleCreatePostModal(false);
                    }
                },
                error: error => {
                    this.showError(error['error'] ? error['error'].code || 8 : 8);
                    this.loading.post = false;
                },
                complete: () => {
                    this.loading.post = false;
                }
            });
        }
    }

    onToggleCreatePostModal(visible: boolean) {
        this.visibleCreatePostModal = visible;
    }

    notiSubmitPostSuccess() {
        this.onSubmitPostSuccess.emit();
    }
}