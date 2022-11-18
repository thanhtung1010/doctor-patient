import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { emailPatternValidator } from 'app/_cores/_enums/validator.enum';
import { Helpers } from 'app/_cores/_helpers';
import { CommonService } from 'app/_cores/_services/common.service';
import { ROUTING_DEFINED } from 'app/_share/_enum';
import { getSystemMsgByCode } from 'app/_share/_enum/errors.enum';
import { loadingType } from 'app/_share/_enum/loading.enum';
import { BookingModel } from 'app/_share/_models/booking.model';
import { BookingService, SessionService } from 'app/_share/_services';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  LOADING_TYPE = loadingType;
  signUp: boolean = false
  loginForm!: FormGroup;
  signupFrom!: FormGroup;
  _paramsForBooking: BookingModel | null = null

  loading = {
    login: false,
    register: false,
  }

  constructor(
    private fb: FormBuilder,
    private commonSer: CommonService,
    private message: NzMessageService,
    private translate: TranslateService,
    private sesionSer: SessionService,
    private route: Router,
    private bookingSer: BookingService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    const _object = Helpers.convertParamsToObject(Helpers.getParamString());
    if (_.size(_object)) {
      this._paramsForBooking = new BookingModel(_object);
    }
    this.signUp = Helpers.checkBooleanParam(Helpers.getQueryString('signUp'))
  }

  onClickToSignUp(evt: boolean) {
    this.signUp = evt;
    // this.createForm()
  }

  createForm() {
    if (!this.loginForm) {
      this.loginForm = this.fb.group({
        email: [null, [Validators.required, emailPatternValidator]],
        password: [null, [Validators.required, Validators.minLength(6)]]
      })
    }
    if (!this.signupFrom) {
      this.signupFrom = this.fb.group({
        email: [null, [Validators.required, emailPatternValidator]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        fullName: [null, [Validators.required]],
        age: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        phone: [null, [Validators.required, this.phoneValidators]],
      })
    }
  }

  phoneValidators = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value)
      return { phone: true };

    if (control.value.length > 10 || control.value.length < 10) {
      return { phone: true };
    }
    return {};
  };

  login() {
    const _params = this.prepareRequestData();
    this.loading.login = true;
    this.commonSer.login(_params).subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          if (this.commonSer.handleLogin(resp.data)) {

            this.commonSer.getUserInfo().subscribe({
              next: (res) => {
                if (res && res.data) {
                  const _setUser = this.sesionSer.setUserLogged(resp.data['accessToken'], {
                    ...res.data,
                    role: res.data['role'] ? res.data['role'].toUpperCase() : ''
                  });
                  if (!_setUser) {
                    this.showError('8');
                  }
                } else {
                  this.showError('8');
                }
              },
              error: (error) => {
                this.showError(error['error'] ? error['error'].code : '8');
              },
              complete: () => {
                this.checkBooking();
              }
            });
          }
        }
        this.loading.login = false;
      },
      error: (error) => {
        this.loading.login = false;
        this.showError(error['error'] ? error['error'].code : '8');
      },
      complete: () => { }
    });

  }

  register() {
    const _params = this.prepareRequestData();
    this.loading.register = true;
    this.commonSer.register(_params).subscribe({
      next: (resp) => {
        if (this.commonSer.handleLogin(resp.data)) {

          this.commonSer.getUserInfo().subscribe({
            next: (res) => {
              if (res && res.data) {
                const _setUser = this.sesionSer.setUserLogged(resp.data['accessToken'], {
                  ...res.data,
                  role: res.data['role'] ? res.data['role'].toUpperCase() : ''
                });
                if (!_setUser) {
                  this.showError('8');
                }
              } else {
                this.showError('8');
              }
            },
            error: (error) => {
              this.showError(error['error'] ? error['error'].code : '8');
            },
            complete: () => {
              this.checkBooking();
            }
          });
        }
        this.loading.register = false;
      },
      error: (error) => {
        this.loading.register = false;
        this.showError(error['error'] ? error['error'].code : '8');
      },
      complete: () => { }
    });
  }

  checkBooking() {
    if (this.sesionSer.isLogged()) {
      if (this._paramsForBooking && _.size(this._paramsForBooking)) {
        this.bookingSer.book({ ...this._paramsForBooking }).subscribe({
          next: resp => {
            this.route.navigate([ROUTING_DEFINED.HOME])
            this.showSuccess();
          },
          error: error => {
            this.showError(error['error'] ? error['error'].code : '8');
          },
          complete() { },
        });
      } else {
        this.route.navigate([ROUTING_DEFINED.HOME])
      }
    }
  }

  prepareRequestData() {
    if (this.signUp) {
      return {
        ...this.signupFrom.value,
        age: +this.signupFrom.value['age'] || 0
      }
    }
    return {
      ...this.loginForm.value
    }
  }

  showError(code: string) {
    const _msg = getSystemMsgByCode(code || '8') as string;
    this.message.error(this.translate.instant(_msg));
  }

  showSuccess() {
    this.message.success(this.translate.instant('SYS_MSG.SUCCESS'));
  }
}
