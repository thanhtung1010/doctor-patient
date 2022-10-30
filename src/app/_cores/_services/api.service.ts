import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { GlobalConfig } from '../_enums/global.enum';
import { IApiObject } from '../_interfaces/api-url.interface';
import { IApiBaseResponse } from '../_interceptors/api-base-response.interface';
import { cookieHelper } from '../_helpers/cookieHelper';
import { Helpers } from '../_helpers/helpers';

@Injectable()
export class APIService {
  constructor(
    private readonly http: HttpClient
  ) { }

  buildURI(external: boolean, url: string) {
    if (external) {
      return url;
    }
    return `${GlobalConfig.API_URL}${url}`;
  }

  setHeader(_customHeader?: any, url?: string) {
    let _cookie = new cookieHelper();
    let access_token = _cookie.get(GlobalConfig.TOKEN_KEY);
    let headers: HttpHeaders = new HttpHeaders();

    if (!_.isEmpty(access_token)) {
      headers = headers.append('Authorization', `Bearer ${access_token}`);
    }
    headers = headers.append('Content-Type', 'application/json');

    if (_customHeader) {
      for (let d in _customHeader) {
        headers = headers.set(d, _customHeader[d])
      }
    }
    return headers;
  }
  setInit(customHeader: any, customParams?: any, notReplaceHeader: boolean = false, url?: string) {
    const headers = notReplaceHeader ? customHeader : this.setHeader(customHeader, url);
    let _init = {
      headers: headers,
      withCredentials: undefined,
      reportProgress: undefined,
      responseType: undefined,// 'arraybuffer'|'blob'|'json'|'text',
      observe: undefined
    };
    if (customParams) {
      _init = { ..._init, ...customParams }
    }
    return _init;
  }

  callApi(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildURI(!!object.external, object.url);
      const initials = this.setInit(customHeader, customParams, false, _url);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  callApiWithFile(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildURI(!!object.external, object.url);
      const initials = this.setInit(customHeader, customParams);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption);
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  callApiWithCustomHeader(object: IApiObject, body: any, customHeader?: any, customParams?: any) {
    try {
      const _url = this.buildURI(!!object.external, object.url);
      const initials = this.setInit(customHeader, customParams, true);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  //#region  Upload File
  callApiUpload(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildURI(!!object.external, object.url);
      const initials = this.setInitUpload(customParams);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  setHeaderUpload() {
    let _cookie = new cookieHelper();
    let access_token = _cookie.get(GlobalConfig.TOKEN_KEY);
    let headers: HttpHeaders = new HttpHeaders();

    if (!_.isEmpty(access_token)) {
      headers = headers.append('Authorization', `Bearer ${access_token}`);
    }
    return headers;
  }

  setInitUpload(customParams?: any) {
    const headers = this.setHeaderUpload();
    let _init = {
      headers: headers,
      withCredentials: undefined,
      reportProgress: undefined,
      responseType: undefined,// 'arraybuffer'|'blob'|'json'|'text',
      observe: undefined
    };
    if (customParams) {
      _init = { ..._init, ...customParams }
    }
    return _init;
  }

  //#endregion

  //#region Download ZIP File
  callZIPArchive(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildURI(!!object.external, object.url);
      const initials = this.setInitZIPArchive(customParams);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  setHeaderZIPArchive() {
    let _cookie = new cookieHelper();
    let access_token = _cookie.get(GlobalConfig.TOKEN_KEY);
    let headers: HttpHeaders = new HttpHeaders();

    if (!_.isEmpty(access_token)) {
      headers = headers.append('Authorization', `Bearer ${access_token}`);
    }
    headers = headers.append('Content-Language', Helpers.getCurrentLang());
    // headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('Timezone-Offset', Helpers.timezone());
    // headers = headers.append('language', Helpers.getCurrentLang());
    // headers = headers.append('Origin-Url', window.location.hostname)
    return headers;
  }

  setInitZIPArchive(customParams?: any) {
    const headers = this.setHeaderUpload();
    let _init = {
      headers: headers,
      withCredentials: undefined,
      reportProgress: undefined,
      responseType: "blob" as const,// 'arraybuffer'|'blob'|'json'|'text',
      observe: undefined
    };
    if (customParams) {
      _init = { ..._init, ...customParams }
    }
    return _init;
  }

  //#endregion

}
