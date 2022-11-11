import { Component, OnInit } from "@angular/core";
import { Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { getTitleByField, USER_FIELD } from "app/_cores/_enums/user.enum";
import { IUserProfile } from "app/_cores/_models/user.model";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROUTING_DEFINED } from "app/_share/_enum/router.enum";
import { IPost } from "app/_share/_interface/post.interface";
import { SessionService, ShareService } from "app/_share/_services";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {
    userInfo: IUserProfile | null = null;
    loading = {
        post: false,
    }
    data = {
        posts: [] as IPost[],
        userInforList: [] as {
            value: any,
            field: string,
            title: string
        }[],
    }
    USER_FIELD = USER_FIELD;
    ROUTING_DEFINED = ROUTING_DEFINED;
    constructor(
        private sessionSer: SessionService,
        private shareSer: ShareService,
        private translate: TranslateService,
        private msg: NzMessageService,
    ) { }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getListUserInfor();
        this.getPostByID();
    }

    getListUserInfor() {
        this.userInfo = this.sessionSer.getUserInfor();
        if (this.userInfo && _.size(this.userInfo)) {
            for (const field in this.userInfo) {
                const _title = this.getTitleByField(field);
                if (_title) {
                    this.data.userInforList.push({
                        value: this.getValueByField(field),
                        field: field,
                        title: _title
                    });
                }
            }
        }
    }

    getPostByID() {
        this.loading.post = true;
        this.shareSer.getPostByID({ userId: this.sessionSer.getID() }).subscribe({
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

    getTitleByField(field: string): string | null {
        return getTitleByField(field);
    }

    getValueByField(field: string): string | number {
        if (field === USER_FIELD.gender) {
            return (this.userInfo as any)[field] === 1 ? 'OUTSIDE.SIGN_UP.MALE' : 'OUTSIDE.SIGN_UP.FEMALE'
        }
        return (this.userInfo as any)[field]
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }
}