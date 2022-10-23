import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpUserEvent,
  HttpHeaders,
} from '@angular/common/http';
import { filter, tap, timeout } from 'rxjs/operators';
import * as _ from 'lodash';
import { CommonService } from '../_services/common.service';
import { GlobalConfig } from '../_enums/global.enum';

@Injectable()
export class HttpLogInterceptor implements HttpInterceptor {
  constructor(
    private commonService: CommonService
  ) { }

  handleLogout() {
    this.commonService.handleLogout();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    return next
      .handle(req)
      .pipe(
        timeout(GlobalConfig.TIME_OUT_MS),
        filter(e => e.type !== 0),
        tap((response: any) => {
          if (response instanceof HttpErrorResponse) {
            // console.log('=== [ERR RESPONSE] === \n ', response);
            // console.log('=== [ERR REQUESTS] :: FROM ' + req.url);

            // CHECK STATUS FROM SERVER
            if (response.status === 401) {
              /**
               * Navigate to the un-authorize routing
               */
              this.handleLogout()
            }
          }

        },
          (error: any) => {
            // console.error(error, error['status'] || 500)
            if (error && error.status > 500) {
              // this.commonService.showSystemError('SYS_MSG.SOMETHING_WRONG');
              return error;
            }
            if (error['status'] === 401) {
              this.handleLogout()
            }
          },
        ),
      );
  }
}
