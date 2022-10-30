import { IApiUrl } from "../_interfaces/api-url.interface";

export const API_URL: IApiUrl = {
  LOGIN: {
    method: 'POST',
    url: 'login'
  },
  REGISTER: {
    method: 'POST',
    url: 'users/register'
  },
  LOGOUT: {
    method: 'POST',
    url: 'api/logout'
  },
  GET_USER_INFO: {
    method: 'POST',
    url: 'users/my-profile'
  },
  GET_CURRENT_INFO: {
    method: 'POST',
    url: ''
  },
  PROFILE_UPDATE: {
    method: 'POST',
    url: ''
  },
}
