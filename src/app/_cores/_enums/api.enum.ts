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
    url: 'logout'
  },
  GET_USER_INFO: {
    method: 'POST',
    url: 'users/my-profile'
  },
  GET_USER_INFO_BY_ID: {
    method: 'POST',
    url: 'users/profile/'
  },
  GET_CURRENT_INFO: {
    method: 'POST',
    url: ''
  },
  PROFILE_UPDATE: {
    method: 'POST',
    url: ''
  },
  GET_ALL_USER: {
    method: 'POST',
    url: 'admin/user/all'
  },
  GET_ALL_BOOKED: {
    method: 'POST',
    url: 'admin/booking/all'
  },
}
