import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'app/_cores/_services/common.service';
import { ROUTING_DEFINED } from 'app/_share/_enum';
import { getSystemMsgByCode } from 'app/_share/_enum/errors.enum';
import { loadingType } from 'app/_share/_enum/loading.enum';
import { SessionService } from 'app/_share/_services';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  LOADING_TYPE = loadingType;
  signUp: boolean = false
  loginForm!: FormGroup;

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
    private route: Router
  ) { }

  ngOnInit(): void {
    this.createForm(true);
  }

  onClickToSignUp(evt: boolean) {
    this.signUp = evt;
    this.createForm(!evt)
  }

  createForm(isLogin: boolean) {
    if (!this.loginForm) {
      this.loginForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]]
      })
    }
    if (this.signUp) {
      this.loginForm.addControl('fullName', new FormControl(null, [Validators.required]));
      this.loginForm.addControl('age', new FormControl(null, [Validators.required]));
      this.loginForm.addControl('gender', new FormControl(null, [Validators.required]));
      this.loginForm.addControl('phone', new FormControl(null, [Validators.required, this.phoneValidators]));
    } else {
      this.loginForm.removeControl('fullName');
      this.loginForm.removeControl('age');
      this.loginForm.removeControl('gender');
      this.loginForm.removeControl('phone');
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
                  if (this.sesionSer.setUserLogged(resp.data['accessToken'], {
                    ...res.data,
                    role: res.data['role'] ? res.data['role'].toUpperCase() : ''
                  })) {
                    this.route.navigate([ROUTING_DEFINED.HOME])
                  } else {
                    this.showError('8');
                  }
                } else {
                  this.showError('8');
                }
              },
              error: (error) => {
                this.showError(error['error'] ? error['error'].code : '8');
              },
              complete: () => { }
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
                if (this.sesionSer.setUserLogged(resp.data['accessToken'], {
                  ...res.data,
                  role: res.data['role'] ? res.data['role'].toUpperCase() : ''
                })) {
                  this.route.navigate([ROUTING_DEFINED.HOME])
                } else {
                  this.showError('8');
                }
              } else {
                this.showError('8');
              }
            },
            error: (error) => {
              this.showError(error['error'] ? error['error'].code : '8');
            },
            complete: () => { }
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

  prepareRequestData() {
    if (!this.loginForm.value) return
    if (this.signUp) {
      return {
        ...this.loginForm.value,
        age: +this.loginForm.value['age'] || 0
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
}
