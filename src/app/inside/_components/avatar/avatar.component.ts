import { Component, OnInit } from "@angular/core";
import { Params, Router } from "@angular/router";
import { CommonService } from "app/_cores/_services/common.service";
import { ROUTING_DEFINED } from "app/_share/_enum";
import { ROLE } from "app/_share/_enum/role.enum";
import { SessionService } from "app/_share/_services";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html'
})

export class AvatarComponent implements OnInit {
    avatarText: string = '';
    menus = [
        {
            title: 'HEADER.PROFILE',
            url: ROUTING_DEFINED.PROFILE,
            role: []
        },
        {
            title: 'HEADER.MANAGER',
            url: ROUTING_DEFINED.MANAGER,
            role: [ROLE.ADMIN]
        },
        {
            title: 'HEADER.LOG_OUT',
            url: null,
            role: []
        }
    ] as any[]

    constructor(
        private sessionSer: SessionService,
        private _router: Router,
        private commonSer: CommonService
    ) { }

    ngOnInit(): void {
        this.avatarText = this.sessionSer.getTextAvatar();
        this.prepareMenu();
    }

    prepareMenu() {
        const _role = this.sessionSer.getRole();
        this.menus = this.menus.filter(menu => !menu.role.length || menu.role.includes(_role))
    }

    logOut() {
        this.commonSer.logout().subscribe({
            next: res => {
                this.commonSer.handleLogout();
            },
            error: error => {
                this.commonSer.handleLogout();
            },
            complete: () => {
                this.commonSer.handleLogout();
            }
        });
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