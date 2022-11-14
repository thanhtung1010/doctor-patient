import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Helpers } from "app/_cores/_helpers";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { IPost } from "app/_share/_interface";
import { ShareService } from "app/_share/_services/share.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { HomePageModel } from "../_models";

@Component({
    selector: "app-home-page",
    templateUrl: "./home-page.component.html"
})

export class HomePageComponent implements OnInit {
    data = {
        posts: [] as IPost[],
        threads: [] as { id: number, name: string }[]
    }
    loading = {
        post: false,
        thread: false,
    }
    params!: HomePageModel
    constructor(
        private translate: TranslateService,
        private shareSer: ShareService,
        private msg: NzMessageService,
        private _router: Router,
    ) { }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.parseParams();
        this.getAllThread();
    }

    parseParams() {
        const _object = Helpers.convertParamsToObject(Helpers.getParamString());
        this.params = new HomePageModel(_object || null);
        this.changeURL();
    }

    changeURL() {
        this._router.navigate([], {
            queryParams: this.params || {},
            queryParamsHandling: 'merge'
        });
        this.getPost();
    }

    getPost() {
        if (this.params && this.params.threadId) {
            this.getPostbyThread();
        } else {
            this.getAllPost();
        }
    }

    getAllPost() {
        this.loading.post = true;
        this.shareSer.getAllPost().subscribe({
            next: resp => {
                if (resp.data && resp.data.length) {
                    this.data.posts = resp.data;
                } else {
                    this.data.posts = [];
                }
                this.loading.post = false;
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

    getAllThread() {
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

    getPostbyThread() {
        this.loading.post = true;
        const _params = { threadId: this.params.threadId }
        this.shareSer.getPostByThread(_params).subscribe({
            next: resp => {
                if (resp.data && resp.data.length) {
                    this.data.posts = resp.data;
                } else {
                    this.data.posts = [];
                }
                this.loading.post = false;
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

    onChangeThread(id: number) {
        this.params.threadId = +id;
        this.params = new HomePageModel(this.params);
        this.changeURL();
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }

}