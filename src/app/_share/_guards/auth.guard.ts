import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LocalStorageHelper } from "app/_cores/_helpers/local-storage.helper";
import { Observable } from "rxjs";;

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return true
    // if (LocalStorageHelper.get('token')) {
    //   return true
    // } else {
    //   this._router.navigate(['outside']);
    //   return false
    // }
  }
}