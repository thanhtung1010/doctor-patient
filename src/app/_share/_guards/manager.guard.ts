import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { cookieHelper } from "app/_cores/_helpers";
import { CommonService } from "app/_cores/_services/common.service";
import { Observable, of } from "rxjs";
import { ROUTING_DEFINED } from "../_enum";
import { SessionService } from "../_services";
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ManagerGuard implements CanActivate {
    constructor(
        private _router: Router,
        private readonly _sessionSer: SessionService,
        private readonly _commonService: CommonService
    ) {
    }

    handleLogout(gotoAuth: boolean = false) {
        this._commonService.handleLogout(gotoAuth);
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        if ((this._sessionSer.IsLoaded || this._sessionSer.isLogged()) && this._sessionSer.isAdmin()) {
            return true
        } else {
            const _coockie = new cookieHelper()
            if (_coockie.get('token')) {
                return this._commonService.getUserInfo().pipe(map((val: any) => {
                    if (val && val['data']) {
                        this._sessionSer.setUserLogged((new cookieHelper().get('token')), {
                            ...val['data'],
                            role: val['data'].role ? val['data'].role.toUpperCase() : ''
                        });
                        return true
                    } else {
                        this.handleLogout();
                        return false;
                    }
                }), catchError(() => {
                    this.handleLogout();
                    this._router.navigate([ROUTING_DEFINED.NOTFOUND]);
                    return of(false)
                }))
            } else {
                this._router.navigate([ROUTING_DEFINED.NOTFOUND]);
                return false
            }
        }
    }
}