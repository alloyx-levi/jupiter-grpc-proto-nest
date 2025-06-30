// 通用类型定义
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

export interface BaseResponse {
  success: boolean;
  message: string;
}
