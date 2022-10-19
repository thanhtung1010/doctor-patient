import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { loadingType } from 'app/_share/_enum/loading.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  LOADING_TYPE = loadingType;
  signUp: boolean = false
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder
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
      this.loginForm.addControl('gender', new FormControl(true));
      this.loginForm.addControl('phone', new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]));
    } else {
      this.loginForm.removeControl('fullName');
      this.loginForm.removeControl('age');
      this.loginForm.removeControl('gender');
      this.loginForm.removeControl('phone');
    }
  }

}
