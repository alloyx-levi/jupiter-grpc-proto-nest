// Common type definitions
export interface Timestamp {
  seconds: number;
  nanos: number;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: Timestamp;
}

export interface PaginationRequest {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
}

export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  timestamp: Timestamp;
  requestId?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
