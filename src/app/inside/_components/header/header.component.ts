import { Component, OnInit } from "@angular/core";
import { Params, Router } from "@angular/router";
import { ROUTING_DEFINED } from "app/_share/_enum/router.enum";
import { SessionService } from "app/_share/_services";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
    ROUTING_DEFINED = ROUTING_DEFINED
    isLogged = false
    constructor(
        private _router: Router,
        private sessionSer: SessionService
    ) { }

    ngOnInit(): void {
        this.isLogged = this.sessionSer.isLogged();
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