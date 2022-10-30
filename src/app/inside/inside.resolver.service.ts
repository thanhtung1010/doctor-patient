import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { cookieHelper } from 'app/_cores/_helpers';
import { CommonService } from 'app/_cores/_services/common.service';
import { SessionService } from 'app/_share/_services/session.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InsideChildResolver implements Resolve<boolean> {
  constructor(
    private readonly _sessionService: SessionService,
    private readonly _commonService: CommonService) {
  }

  handleLogout() {
    this._commonService.handleLogout();
  }

  resolve(): Observable<any> | Promise<any> | any {
    if (this._sessionService.hasTokenOnLocal()) {
      if (this._sessionService.IsLoaded || this._sessionService.isLogged()) {
        return true;
      }
      return this._commonService.getUserInfo().pipe(map((val: any) => {
        if (val && val['data']) {
          this._sessionService.setUserLogged((new cookieHelper().get('token')), val['data']);
          return of(true)
        }
        return of(false);
      }), catchError(() => {
        // console.log('catchError resolve')
        // Helpers.loading.toggle(false)
        return of(false)
      }));
    } else {
      return of(this.handleLogout());
    }
  }
}
