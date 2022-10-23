import { Injectable } from "@angular/core";
import { APIService } from "app/_cores/_services/api.service";
import { LOGIN_API } from "../_enum/api.enum";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private api: APIService) { }

    login(_params: any) {
        return this.api.callApi(LOGIN_API['LOGIN'], _params);
    }
    register(_params: any) {
        return this.api.callApi(LOGIN_API['REGISTER'], _params);
    }
}