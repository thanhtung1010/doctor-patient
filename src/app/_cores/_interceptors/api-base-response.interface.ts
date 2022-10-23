export interface IApiBaseResponse {
  data: any;
  message: string;
  message_code: number;
  status: string;
  meta: IApiBaseMeta;
}

export interface IApiBaseMeta {
  sort?: any[];
  filter?: any[];

  pageNumber: number,
  pageSize: number;
  totalPages: number;
  totalElements?: number;
}

export interface IApiPaggingResponse {
  content: any;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  size: number;
  pageable: any;
  sort: any;
}
