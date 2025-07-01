import { Observable } from 'rxjs';
import { HealthCheckResponse, BaseResponse, Timestamp, ResponseMeta } from '../types/common.types';

// Authorization service interface definition
export interface IAuthorizationService {
  // Permission management
  createPermission(request: CreatePermissionRequest): Observable<CreatePermissionResponse>;
  getPermissions(request: GetAuthPermissionsRequest): Observable<GetAuthPermissionsResponse>;
  updatePermission(request: UpdateAuthPermissionRequest): Observable<UpdateAuthPermissionResponse>;
  deletePermission(request: DeleteAuthPermissionRequest): Observable<DeleteAuthPermissionResponse>;

  // Common transactions
  getTransactions(request: GetAuthTransactionsRequest): Observable<GetAuthTransactionsResponse>;

  // Health check
  healthCheck(request: void): Observable<HealthCheckResponse>;
}

// Permission data model
export interface AuthPermission {
  id: number;
  name: string;
  code: string;
  description: string;
  service: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}

// Transaction data model
export interface AuthTransaction {
  id: number;
  type: string;
  status: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create permission request and response
export interface CreatePermissionRequest {
  name: string;
  code: string;
  description: string;
  service: string;
}

export interface CreatePermissionResponse extends BaseResponse<AuthPermission> { }

// Get permissions request and response
export interface GetAuthPermissionsRequest {
  page?: number;
  limit?: number;
  service?: string;
  search?: string;
}

export interface GetAuthPermissionsResponse extends BaseResponse<AuthPermission[]> { }

// Update permission request and response
export interface UpdateAuthPermissionRequest {
  permissionId: number;
  name?: string;
  code?: string;
  description?: string;
  service?: string;
}

export interface UpdateAuthPermissionResponse extends BaseResponse<AuthPermission> { }

// Delete permission request and response
export interface DeleteAuthPermissionRequest {
  permissionId: number;
  hardDelete: boolean;
}

export interface DeleteAuthPermissionResponse extends BaseResponse<void> { }

// Get transactions request and response
export interface GetAuthTransactionsRequest {
  page?: number;
  limit?: number;
}

export interface GetAuthTransactionsResponse extends BaseResponse<AuthTransaction[]> { }
