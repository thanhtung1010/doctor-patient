export interface IApiUrl {
  [keys: string]: IApiObject;
}
export interface IApiObject {
  url: string;
  method: "DELETE" | "GET" | "HEAD" | "JSONP" | "OPTIONS" | "POST" | "PUT" | "PATCH";
  authorize?: boolean;
  external?: boolean;
}
