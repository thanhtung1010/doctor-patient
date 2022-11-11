import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { IPost } from "app/_share/_interface";
import { ShareService } from "app/_share/_services/share.service";
import { NzMessageService } from "ng-zorro-antd/message";

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
    constructor(
        private translate: TranslateService,
        private shareSer: ShareService,
        private msg: NzMessageService,
    ) { }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getAllPost();
        this.getAllThread();
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

    getPostbyThread(id: number) {
        this.loading.post = true;
        const _params = { threadId: id }
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

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }

}