import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { IPost } from "app/_share/_interface";
import { ITableElement } from "app/_share/_interface/share.interface";
import { ShareService } from "app/_share/_services/share.service";
import { environment } from "environments/environment";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: "app-post-manager",
    templateUrl: "./post-manager.component.html"
})

export class PostManagerComponent implements OnInit {
    data = {
        posts: [] as IPost[],
    }
    loading = {
        post: false,
    }
    tableHeader: ITableElement[] = [
        { title: "Tựa đề", field: "title", width: '200' },
        { title: "Tác giả", field: "author", width: '200' },
        { title: "Ngày tạo", field: "createAt", width: '200' },
        { title: "Lần cập nhật cuối", field: "updateAt", width: '200' },
        { title: "", field: "action", width: '50' },
    ]
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';

    constructor(
        private translate: TranslateService,
        private shareSer: ShareService,
        private msg: NzMessageService,
    ) {
        this.defautlFormat = environment.FORMAT_SETTING
        if (this.defautlFormat) {
            this._dateFormatForShow = this.defautlFormat.date;
            this.dateFormatForEdit = this._dateFormatForShow ? this._dateFormatForShow.replace('DD', 'dd').replace('YYYY', 'yyyy') : '';
        }
    }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getAllPost();
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

    deletePost(id: number) {
        this.loading.post = true;
        this.shareSer.deletePost({ id: id }).subscribe({
            next: resp => {
                this.showSuccess();
                this.getAllPost();
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