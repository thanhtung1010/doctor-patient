import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTING_DEFINED } from 'app/_share/_enum';
import { BehaviorSubject } from 'rxjs';
import { API_URL } from '../_enums/api.enum';
import { cookieHelper } from '../_helpers/cookieHelper';;
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public systemError: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private apiService: APIService,
    private router: Router) { }

  getUserInfo() {
    return this.apiService.callApi(API_URL['GET_USER_INFO'], {});
  }

  getUserInfoById(id: number) {
    return this.apiService.callApi(
      {
        ...API_URL['GET_USER_INFO_BY_ID'],
        url: API_URL['GET_USER_INFO_BY_ID'].url + id
      }, {});
  }

  logout() {
    return this.apiService.callApi(API_URL['LOGOUT'], {});
  }

  login(_params: any) {
    return this.apiService.callApi(API_URL['LOGIN'], _params);
  }

  register(_params: any) {
    return this.apiService.callApi(API_URL['REGISTER'], _params);
  }

  handleLogout(gotoAuth: boolean = true) {
    const _cookie = new cookieHelper();
    _cookie.remove('token');
    if (gotoAuth) this.router.navigate([ROUTING_DEFINED.OUTSIDE])
  }

  handleLogin(tokenInfor: any): boolean {
    const _cookie = new cookieHelper();
    if (tokenInfor['accessToken']) {
      _cookie.setWithDefault('token', tokenInfor['accessToken'], '/', tokenInfor['expiredIn'] || '');
      return true
    }
    return false
  }

  getAllAccount() {
    return this.apiService.callApi(API_URL['GET_ALL_USER'], {});
  }

  getAllBooked() {
    return this.apiService.callApi(API_URL['GET_ALL_BOOKED'], {});
  }

  showSystemError(_msg: string) {
    this.systemError.next(_msg);
  }
}
