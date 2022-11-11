import { Injectable } from '@angular/core';
import { API_URL } from 'app/_cores/_enums/api.enum';
import { GlobalConfig } from 'app/_cores/_enums/global.enum';
import { Helpers } from 'app/_cores/_helpers';
import { cookieHelper } from 'app/_cores/_helpers/cookieHelper';
import { LocalStorageHelper } from 'app/_cores/_helpers/local-storage.helper';
import { AppUser, IUserProfile } from 'app/_cores/_models';
import { APIService } from 'app/_cores/_services/api.service';
import { CommonService } from 'app/_cores/_services/common.service';
import { environment } from 'environments/environment';
import * as _ from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ROLE } from '../_enum/role.enum';

@Injectable({
  providedIn: 'root'
})
/**
 * App Session service
 * Use to get user or session storage
 */
export class SessionService {
  private UserLogged: AppUser | null = null;
  public userLoggerBehavior: ReplaySubject<any> = new ReplaySubject(0);
  constructor(
    private readonly api: APIService,
    private commonService: CommonService
  ) { }

  /**
   * Get variable if user has been logged
   * @returns Boolean
   */
  isLogged(): boolean {
    return !_.isNull(this.UserLogged) && !_.isEmpty(this.UserLogged.authToken);
  }

  get IsLoaded(): boolean {
    return this.UserLogged?.userLoaded || false;
  }

  /**
   *  Get fullName
   * @returns String: FullName of user logged
   */
  getFullName(): string {
    return !_.isNull(this.UserLogged) ? this.UserLogged.fullName : '';
  }

  /**
   *  Get fullName
   * @returns Number: user ID
   */
  getID(): number {
    return !_.isNull(this.UserLogged) ? this.UserLogged.id : 0;
  }

  /**
   *  Get User infor
   * @returns object
   */
  getUserInfor(): IUserProfile | null {
    return this.isLogged() ? (this.UserLogged as IUserProfile) : null;
  }

  /**
   *  Get User infor
   * @returns object
   */
  getUserPost(): any[] {
    return !_.isNull(this.UserLogged) ? this.UserLogged.postSearchResultDtoList || [] : [];
  }

  /**
   *  Get fullName
   * @returns String: First word of full name
   */
  getTextAvatar(): string {
    if (this.UserLogged) {
      if (this.UserLogged.fullName.length > 0) {
        for (let i = 0; i < this.UserLogged.fullName.length; i++) {
          if (this.UserLogged.fullName[i].trim()) {
            return this.UserLogged.fullName[i].toUpperCase();
          }
        }
      }
    }
    return ''
  }

  /**
   * Get access token
   * @param _fromLocal get Token on local
   * @returns Void
   */
  getToken(_fromLocal?: boolean): string | null {
    return _fromLocal ?
      (new cookieHelper()).get(GlobalConfig.TOKEN_KEY) :
      !_.isNull(this.UserLogged) ? this.UserLogged.authToken : '';
  }
  getUserEmail() {
    if (!_.isNull(this.UserLogged)) {
      return this.UserLogged.email;
    }
    return '';
  }
  getRole() {
    if (!_.isNull(this.UserLogged)) {
      return this.UserLogged.role;
    }
    return '';
  }

  isAdmin() {
    if (!_.isNull(this.UserLogged)) {
      return this.UserLogged.role === ROLE.ADMIN;
    }
    return false;
  }

  isUser() {
    if (!_.isNull(this.UserLogged)) {
      return this.UserLogged.role === ROLE.USER;
    }
    return false;
  }

  isDoctor() {
    if (!_.isNull(this.UserLogged)) {
      return this.UserLogged.role === ROLE.DOCTOR;
    }
    return false;
  }

  /**
   * Set access token
   * @param token Access token
   * @returns void
   */
  setToken(token: string | null) {
    if (token && !_.isEmpty(token)) {
      if (this.UserLogged)
        this.UserLogged.setToken(token);
      else {
        this.UserLogged = new AppUser('', token);
      }
      return true;
    }
    return false;
  }

  /**
   * Set user has been logged
   * @param token Access token
   * @param username Username
   * @param info Other information
   * @returns Boolean
   */
  setUserLogged(token: string, info?: any): boolean {
    if (!_.isEmpty(token)) {
      this.UserLogged = new AppUser(token, info);
      return true;
    }
    return false;
  }

  /**
   * Check if access token has been created before
   * @returns Boolean
   */
  hasTokenOnLocal(): boolean {
    return !_.isEmpty((new cookieHelper()).get(GlobalConfig.TOKEN_KEY));
  }

  /**
   * Get User info by token had already saved on local
   * @returns Observable subscribe of user info
   */
  getUserInfoByToken(): Observable<any> {
    return this.api.callApi(API_URL['GET_USER_INFO'], {});
  }

  //#endregion
}
