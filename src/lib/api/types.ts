// ===========================================
// API Types
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  timestamp?: string;
}
export type BackendError = {
  success: false;
  message: string;
  statusCode: number;
  errorType?: string;
  errorSources?: Array<{ path: string; message: string }>;
};
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: HeadersInit;
  timeout?: number;
  tags?: string[];
  revalidate?: number | false;
  retries?: number;
  skipAuth?: boolean;
  cache?: RequestCache;
}
