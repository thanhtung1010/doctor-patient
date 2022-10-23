import { IApiUrl } from "app/_cores/_interfaces/api-url.interface";

export const LOGIN_API: IApiUrl = {
    LOGIN: {
        method: 'POST',
        url: 'login'
    },
    REGISTER: {
        method: 'POST',
        url: 'users/register'
    },
}