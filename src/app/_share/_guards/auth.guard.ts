import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { LocalStorageHelper } from "../_helps";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (LocalStorageHelper.get('token')) {
        return true
    } else {
        this._router.navigate(['outside']);
        return false
    }
  }
}