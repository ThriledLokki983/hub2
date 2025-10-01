interface ApiEndpointInterface {
  endpoint: string;
  method: string;
  cache?: boolean;
  json?: boolean;
  throwError?: boolean;
}

export type {
  ApiEndpointInterface,
}
