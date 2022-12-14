import { Injectable } from "@angular/core";
import { APIService } from "app/_cores/_services/api.service";
import { API_BOOKING, API_URL } from "../_enum/api.enum";

@Injectable({
    providedIn: 'root'
})

export class BookingService {
    constructor(
        private api: APIService
    ) { }

    getAllDoctor() {
        return this.api.callApi(API_BOOKING['GET_ALL_DOCTOR'], {});
    }

    getBookedListByDay(_params: any) {
        return this.api.callApi(API_BOOKING['GET_BOOKED_AT_LIST'], _params || {});
    }

    getBookedListByUser() {
        return this.api.callApi(API_BOOKING['GET_BOOKED_AT_LIST_BY_USER'], {});
    }

    getBookedListByDoctor() {
        return this.api.callApi(API_BOOKING['GET_BOOKED_AT_LIST_BY_DOCTOR'], {});
    }

    book(_params: any) {
        return this.api.callApi(API_BOOKING['BOOK'], _params || {});
    }

    updateBook(id: number, _params: any) {
        return this.api.callApi({
            ...API_BOOKING['UPDATE_BOOK'],
            url: API_BOOKING['UPDATE_BOOK'].url + id
        }, _params || {});
    }

    approvalBooking(id: number, _params: any) {
        return this.api.callApi({
            ...API_BOOKING['APPROVAL_BOOKING'],
            url: API_BOOKING['APPROVAL_BOOKING'].url + id
        }, _params || {});
    }
}