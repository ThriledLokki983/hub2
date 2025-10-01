interface ErrorResponse {
  message?: string;
  statusText?: string;
  status?: number;
}

interface ConnectOptions {
  forced?: boolean;
  silent?: boolean;
  throwError?: boolean;
}

interface ApiResult<T> {
  data: T | [];
  error: string;
  loading: boolean;
  code?: number;
  status?: string;
  message?: string;
}

type ConnectInterface<T> = (
  payload: Record<string, unknown> | null,
  options?: ConnectOptions,
) => Promise<ApiResult<T>>;

type FetchesActiveType = Array<string>;

interface CacheOptions<T = unknown> {
  limit?: number;
  maxAge?: number;
  expire?: (key: string, value: T) => boolean;
}

interface CacheInterface<T = unknown> {
  set(key: string, value: T): void;
  get(key: string): T | undefined;
  remove(key: string): void;
  clear(): void;
}

export type {
  ApiResult,
  CacheOptions,
  ErrorResponse,
  CacheInterface,
  ConnectOptions,
  ConnectInterface,
  FetchesActiveType,
};
