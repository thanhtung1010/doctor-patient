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
    GET_BOOKED_AT_LIST_BY_USER: {
        method: 'POST',
        url: 'booking/get-booking-list-by-user'
    },
    GET_BOOKED_AT_LIST_BY_DOCTOR: {
        method: 'POST',
        url: 'booking/get-booking-list-by-doctor'
    },
}

export const API_POST: IApiUrl = {
    GET_ALL_THREAD: {
        method: "POST",
        url: 'content/get-all-thread'
    },
    CREATE_POST: {
        method: "POST",
        url: 'content/post'
    },
    GET_ALL_POST: {
        method: 'POST',
        url: 'admin/post/all'
    },
    GET_POST_BY_ID: {
        method: 'POST',
        url: 'content/get-post-by-user/'
    },
    GET_POST_BY_THREAD: {
        method: 'POST',
        url: 'content/get-post-inside-thread'
    },
    DELETE_POST: {
        method: 'POST',
        url: 'content/delete'
    },
}