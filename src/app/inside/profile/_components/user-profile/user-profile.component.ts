import { Component, OnInit } from "@angular/core";
import { Params, Router } from "@angular/router";
import { getTitleByField, USER_FIELD } from "app/_cores/_enums/user.enum";
import { IUserProfile } from "app/_cores/_models/user.model";
import { ROUTING_DEFINED } from "app/_share/_enum/router.enum";
import { SessionService } from "app/_share/_services";
import * as _ from "lodash";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {
    userInfo: IUserProfile | null = null;
    userInforList: {
        value: any,
        field: string,
        title: string
    }[] = [];
    USER_FIELD = USER_FIELD;
    ROUTING_DEFINED = ROUTING_DEFINED;
    constructor(
        private sessionSer: SessionService,
    ) {
        this.userInfo = this.sessionSer.getUserInfor();
    }

    ngOnInit(): void {
        this.getListUserInfor();
    }

    getListUserInfor() {
        if (this.userInfo && _.size(this.userInfo)) {
            for (const field in this.userInfo) {
                const _title = this.getTitleByField(field);
                if (_title) {
                    this.userInforList.push({
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
}