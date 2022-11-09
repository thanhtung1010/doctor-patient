import { ROLE } from "app/_share/_enum/role.enum";
import * as _ from "lodash";

export class AppUser {
  private accessToken: string;
  email: string = '';
  fullName: string = "";
  gender: number = 1;
  age: number = 0;
  role: ROLE | '' = ''
  phone: string = '';
  postSearchResultDtoList: any[] = [];
  userLoaded: boolean = false;
  /** And other else fields
   * ...
  */

  constructor(
    _accessToken: string,
    _userInfo?: any
  ) {
    this.accessToken = _accessToken;

    if (_userInfo) {
      if (!_.isEmpty(_userInfo['email'])) {
        this.email = _userInfo['email'];
      }
      if (!_.isEmpty(_userInfo['fullName'])) {
        this.fullName = _userInfo['fullName'];
      }
      if (_.isNumber(_userInfo['gender'])) {
        this.gender = _userInfo['gender'];
      }
      if (_.isNumber(_userInfo['age'])) {
        this.age = _userInfo['age'];
      }
      if (!_.isEmpty(_userInfo['role'])) {
        this.role = _userInfo['role'];
      }
      if (!_.isEmpty(_userInfo['phone'])) {
        this.phone = _userInfo['phone'];
      }
      if (!_.isEmpty(_userInfo['postSearchResultDtoList'])) {
        this.postSearchResultDtoList = _userInfo['postSearchResultDtoList'];
      }

      this.userLoaded = true;
    }
  }

  /**
   * Get User fullName
   */
  public get getFullName(): string {
    return `${this.fullName}`;
  }

  public get authToken(): string {
    return this.accessToken;
  }
  public setToken(_token: string): string {
    return this.accessToken = _token;
  }
}

export interface IUserProfile {
  email: string;
  fullName: string;
  gender: number;
  age: number;
  role: ROLE;
  phone: string;
}

