import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'app/outside/_service/login.service';
import { loadingType } from 'app/_share/_enum/loading.enum';

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
    private loginSer: LoginService
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
    this.loginSer.login(_params).subscribe({
      next: (resp) => {
        console.log('hihi')
        this.loading.login = false;
      },
      error: (error) => {
        console.log('haha')
        this.loading.login = false;
      },
      complete: () => { }
    });

  }

  register() {
    const _params = this.prepareRequestData();
    this.loading.register = true;
    this.loginSer.register(_params).subscribe({
      next: (resp) => {
        console.log('hihi')
        this.loading.register = false;
      },
      error: (err) => {
        console.log('haha')
        this.loading.register = false;
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

}
