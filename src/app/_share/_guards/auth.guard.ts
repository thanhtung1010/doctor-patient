import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { cookieHelper } from "app/_cores/_helpers";
import { CommonService } from "app/_cores/_services/common.service";
import { Observable } from "rxjs"; import { ROUTING_DEFINED } from "../_enum/router.enum";
import { SessionService } from "../_services";
;

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private commonSer: CommonService,
    private sesionSer: SessionService,
    private route: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    if (this.sesionSer.isLogged() || (new cookieHelper().get('token'))) {
      return true
    } else {
      this._router.navigate([ROUTING_DEFINED.OUTSIDE]);
      return false
    }
  }
}