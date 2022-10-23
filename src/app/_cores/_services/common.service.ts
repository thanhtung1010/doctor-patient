import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTING_DEFINED } from 'app/_share/_enum/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from '../_enums/api.enum';
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

  handleLogout() {
    let _retUrl = this.router.url || '';
    return this.router.navigate([ROUTING_DEFINED.OUTSIDE], {
      queryParams: {
        retUrl: _retUrl
      }
    })
  }

  showSystemError(_msg: string) {
    this.systemError.next(_msg);
  }

  profile = {
    getProfile: () => {
      return this.apiService.callApi(API_URL['PROFILE_GET'], null);
    },
    updateProfile: (object: any) => {
      return this.apiService.callApi(API_URL['PROFILE_UPDATE'], object);
    }
  }
}
