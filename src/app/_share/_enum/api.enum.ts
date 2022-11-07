import { IApiUrl } from "app/_cores/_interfaces/api-url.interface";

export const API_URL: IApiUrl = {
    UPLOAD_IMG: {
        method: 'POST',
        url: 'upload'
    }
}

export const API_BOOKING: IApiUrl = {
    GET_ALL_DOCTOR: {
        method: 'POST',
        url: 'doctor/get-doctor-list'
    },
    GET_BOOKED_AT_LIST: {
        method: 'POST',
        url: 'booking/get-booking-list-by-day'
    },
    BOOK: {
        method: 'POST',
        url: 'booking/book'
    },
}