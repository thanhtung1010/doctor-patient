import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Params, Router } from "@angular/router";
import { ROUTING_DEFINED } from "app/_share/_enum";
import { INavigationBar } from "./_interface/nav.interface";

@Component({
    selector: 'app-manager',
    templateUrl: './manager.component.html'
})

export class ManagerComponent implements OnInit {
    navBar: INavigationBar[] = [
        {
            title: 'Tài khoản',
            url: `${ROUTING_DEFINED.MANAGER}/${ROUTING_DEFINED.ACCOUNT}`,
            select: false
        },
        {
            title: 'Bài viết',
            url: `${ROUTING_DEFINED.MANAGER}/${ROUTING_DEFINED.POST}`,
            select: false
        },
        {
            title: 'Lịch hẹn',
            url: `${ROUTING_DEFINED.MANAGER}/${ROUTING_DEFINED.BOOKED}`,
            select: false
        }
    ]
    constructor(
        private _router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        const _currentPath = this._router.url.replace('/', '');
        this.checkSelectMenu(_currentPath);
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
        this.checkSelectMenu(url);
    }

    checkSelectMenu(url: string) {
        this.navBar = this.navBar.map(nav => {
            return {
                ...nav,
                select: false
            }
        });
        const _currentIndex = this.navBar.findIndex(nav => nav.url === url);
        if (_currentIndex > -1) {
            this.navBar[_currentIndex].select = true;
        }
        this.cdr.detectChanges();
    }
}