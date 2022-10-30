import { Injectable } from "@angular/core";
import { APIService } from "app/_cores/_services/api.service";
import { API_URL } from "../_enum/api.enum";

@Injectable({
    providedIn: 'root'
})

export class ShareService {
    constructor(
        private api: APIService
    ) { }

    uploadImg(_params: any) {
        return this.api.callApiUpload(API_URL['UPLOAD_IMG'], _params);
    }
}