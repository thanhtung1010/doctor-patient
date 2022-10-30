import { environment } from "environments/environment";

export const GlobalConfig = {
  DEFAULT_TITLE: environment.appTitle,
  TOKEN_KEY: "token",
  REFRESH_KEY: "refresh_token",
  API_URL: environment.API_URL,
  MAX_NUMBER: 2147483647,
  MIN_SEARCH_LENGTH: 2,
  TIME_OUT_MS: 180000, // 3 mins
  MAX_FILE_SIZE: 26214400 // 25mb
}
