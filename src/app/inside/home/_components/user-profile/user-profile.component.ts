import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { getTitleByField, USER_FIELD } from "app/_cores/_enums/user.enum";
import { Helpers } from "app/_cores/_helpers";
import { IUserProfile } from "app/_cores/_models/user.model";
import { CommonService } from "app/_cores/_services/common.service";
import { ROUTING_DEFINED } from "app/_share/_enum";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { IPost } from "app/_share/_interface/post.interface";
import { SessionService } from "app/_share/_services/session.service";
import { ShareService } from "app/_share/_services/share.service";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";
import { HomePageModel } from "../../_models";

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html"
})

export class UserProfileComponent implements OnInit {
    id: number | null = null;
    userInfo: IUserProfile | null = null;
    data = {
        posts: [] as IPost[],
        userInforList: [] as {
            value: any,
            field: string,
            title: string
        }[],
    }
    loading = {
    }
    routerSub!: ActivatedRoute;
    USER_FIELD = USER_FIELD;
    constructor(
        private translate: TranslateService,
        private shareSer: ShareService,
        private commenSer: CommonService,
        private msg: NzMessageService,
        private _router: Router,
        private _activeRouter: ActivatedRoute,
        private sessionSer: SessionService,
    ) {
    }

    ngOnInit(): void {
        if (!this.routerSub) {
            this.routerSub = this._activeRouter;
            this.routerSub.params.subscribe(params => {
                if (params['id']) {
                    if (!this.userInfo || +params['id'] !== this.id) {
                        this.id = +params['id'];
                        this.getUserInfor();
                    }
                } else {
                    this.goToURL(ROUTING_DEFINED.NOTFOUND);
                }
            })
        }
    }

    getUserInfor() {
        if (this.id) {
            this.commenSer.getUserInfoById(this.id).subscribe({
                next: resp => {
                    if (resp.data && _.size(resp.data)) {
                        this.userInfo = { ...resp.data }
                        if (resp.data['postSearchResultDtoList'] && resp.data['postSearchResultDtoList'].length) {
                            this.data.posts = [...resp.data['postSearchResultDtoList']]
                        }
                        this.getListUserInfor();
                    }
                },
                error: error => {
                    this.showError(error['error'] ? error['error'].code || 8 : 8);
                    this.goToURL(ROUTING_DEFINED.NOTFOUND);
                },
                complete: () => { }
            });
        } else {
            this.goToURL(ROUTING_DEFINED.NOTFOUND);
        }
    }

    getListUserInfor() {
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