import { Injectable } from "@angular/core";
import { APIService } from "app/_cores/_services/api.service";
import { API_POST, API_URL } from "../_enum/api.enum";

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

    uploadImgWithHTTPRequest(_params: any) {
        return this.api.callUploadHTTPRequest(API_URL['UPLOAD_IMG'], _params);
    }

    getThread() {
        return this.api.callApi(API_POST['GET_ALL_THREAD'], {});
    }

    createPost(_params: any) {
        return this.api.callApi(API_POST['CREATE_POST'], _params);
    }

    getAllPost() {
        return this.api.callApi(API_POST['GET_ALL_POST'], {});
    }

    getPostByThread(_params: any) {
        return this.api.callApi(API_POST['GET_POST_BY_THREAD'], _params);
    }
}