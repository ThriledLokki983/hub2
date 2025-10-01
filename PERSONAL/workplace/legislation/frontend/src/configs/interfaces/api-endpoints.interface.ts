interface ApiEndpointInterface {
  endpoint: string;
  method: string;
  cache?: boolean;
  json?: boolean;
  url?: string;
  is_footer: boolean;
  is_login?: boolean;
  throwError?: boolean;
  isFile?: boolean;
}

export type {
  ApiEndpointInterface,
}
