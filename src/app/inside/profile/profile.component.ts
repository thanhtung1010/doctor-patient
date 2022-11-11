import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { Params, Router } from "@angular/router";
import { Helpers } from "app/_cores/_helpers";
import { ROUTING_DEFINED } from "app/_share/_enum/router.enum";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})

export class ProfileComponent {
    ROUTING_DEFINED = ROUTING_DEFINED;
    active: number = 1;
    profileMenu: {
        id: number,
        title: string,
        url: string
    }[] = [
            {
                id: 1,
                title: 'COMMON.INFORMATION',
                url: `${this.ROUTING_DEFINED.PROFILE}`
            },
            {
                id: 2,
                title: 'COMMON.APPOINTMENT_SCHEDULE',
                url: `${this.ROUTING_DEFINED.PROFILE}/${this.ROUTING_DEFINED.YOUR_BOOKED_CALENDAR}`
            },
        ]
    constructor(
        private _router: Router,
        private location: Location
    ) {
        this.checkActive();
    }

    onToggleActive(id: number) {
        this.active = id;
    }

    checkActive() {
        if (this._router.url.includes(ROUTING_DEFINED.YOUR_BOOKED_CALENDAR)) {
            this.active = 2
        }
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