import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Helpers } from "app/_cores/_helpers/helpers";
import { IUserProfile } from "app/_cores/_models/user.model";
import { CommonService } from "app/_cores/_services/common.service";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROLE } from "app/_share/_enum/role.enum";
import { ROUTING_DEFINED } from "app/_share/_enum/router.enum";
import { SessionService } from "app/_share/_services";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
    ROUTING_DEFINED = ROUTING_DEFINED
    isLogged = false;
    selectedUser: number | null = null;
    loading = {
        doctor: false,
    }
    data = {
        doctorRaws: [] as IUserProfile[],
        doctors: [] as IUserProfile[],
    }

    get showBookingHeader(): boolean {
        return this.sessionSer.getRole() === ROLE.USER
    }
    constructor(
        private _router: Router,
        private _activeRouter: ActivatedRoute,
        private sessionSer: SessionService,
        private translate: TranslateService,
        private readonly commonSer: CommonService,
        private msg: NzMessageService,
    ) {
        this._router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this._activeRouter.params.subscribe(params => {
                    if (!params['id']) {
                        this.selectedUser = null;
                    }
                })
            }
        });
    }

    ngOnInit(): void {
        this.isLogged = this.sessionSer.isLogged();
        this.initData();
    }

    initData() {
        this.getAllUser();
    }

    getAllUser() {
        this.loading.doctor = true
        this.commonSer.getAllAccount().subscribe({
            next: resp => {
                if (resp.data && resp.data.length) {
                    this.data.doctorRaws = resp.data.map((item: any) => {
                        return {
                            ...item,
                            role: (item.role || 'USER').toUpperCase()
                        }
                    }).filter((user: IUserProfile) => user.role === ROLE.DOCTOR);
                } else {
                    this.data.doctorRaws = [];
                }
                this.loading.doctor = false;
            },
            error: error => {
                this.showError(error['error'] ? error['error'].code || 8 : 8);
                this.loading.doctor = false;
            },
            complete: () => {
                this.loading.doctor = false;
            }
        });
    }

    onSelectUser() {
        if (this.selectedUser) {
            this.goToURL(Helpers.JoinPaths([ROUTING_DEFINED.HOME, this.selectedUser.toString()]));
        } else {
            this.goToURL(ROUTING_DEFINED.NOTFOUND)
        }
    }

    onSearch(evt: string) {
        if (evt.length) {
            this.data.doctors = this.data.doctorRaws.filter(doctor => (doctor.fullName.toLocaleLowerCase()).includes(evt.toLocaleLowerCase().trim()));
        }
    }

    onOpen(evt: any) {
        this.data.doctors = [];
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

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }
}
