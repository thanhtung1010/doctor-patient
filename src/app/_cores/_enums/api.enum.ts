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
  PROFILE_GET: {
    method: 'POST',
    url: ''
  },
  PROFILE_UPDATE: {
    method: 'POST',
    url: ''
  },
  GET_USER_INFO: {
    method: 'POST',
    url: ''
  }
}
