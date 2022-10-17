import { Component, OnInit } from '@angular/core';
import { loadingType } from 'app/_share/_enum/loading.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  LOADING_TYPE = loadingType;

  constructor() { }

  ngOnInit(): void {
    console.log('hihi')
  }

}
