import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IUserProfile } from "app/_cores/_models";
import { CommonService } from "app/_cores/_services/common.service";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROLE } from "app/_share/_enum/role.enum";
import { IPost } from "app/_share/_interface";
import { ITableElement } from "app/_share/_interface/share.interface";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: "app-account-manager",
    templateUrl: "./account-manager.component.html"
})

export class AccountManagerComponent implements OnInit {
    data = {
        accounts: [] as IUserProfile[],
    }
    loading = {
        account: false,
    }
    ROLE = ROLE
    tableHeader: ITableElement[] = [
        { title: "ID", field: "id", width: '50', align: 'center' },
        { title: "Họ Tên", field: "author", width: '200' },
        { title: "Email", field: "author", width: '200' },
        { title: "Tuổi", field: "createAt", width: '200', align: 'right' },
        { title: "Giới tính", field: "updateAt", width: '200' },
        { title: "Số điện thoại", field: "updateAt", width: '200' },
        { title: "Tài khoản", field: "updateAt", width: '200' },
        { title: "", field: "action", width: '50' },
    ]
    constructor(
        private translate: TranslateService,
        private readonly commonSer: CommonService,
        private msg: NzMessageService,
    ) { }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getAllAccount();
    }

    getAllAccount() {
        this.loading.account = true
        this.commonSer.getAllAccount().subscribe({
            next: resp => {
                if (resp.data && resp.data.length) {
                    this.data.accounts = resp.data.map((item: any) => {
                        return {
                            ...item,
                            role: (item.role || 'USER').toUpperCase()
                        }
                    });
                } else {
                    this.data.accounts = [];
                }
                this.loading.account = false;
            },
            error: error => {
                this.showError(error['error'] ? error['error'].code || 8 : 8);
                this.loading.account = false;
            },
            complete: () => {
                this.loading.account = false;
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