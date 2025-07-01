import { Observable } from 'rxjs';
import { Timestamp, HealthCheckResponse, PaginationRequest, PaginationResponse, BaseResponse } from '../types/common.types';

// Enterprise user service interface definition
export interface IEnterpriseUserService {
  // ========== User Management ==========
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;
  findUsers(request: FindUsersRequest): Observable<FindUsersResponse>;
  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse>;
  deleteUser(request: DeleteUserRequest): Observable<void>;
  updateUserStatus(request: UpdateUserStatusRequest): Observable<UpdateUserStatusResponse>;
  activateUser(request: ActivateUserRequest): Observable<ActivateUserResponse>;

  // ========== Enterprise Management ==========
  createEnterprise(request: CreateEnterpriseRequest): Observable<CreateEnterpriseResponse>;
  queryEnterpriseById(request: QueryEnterpriseByIdRequest): Observable<QueryEnterpriseByIdResponse>;

  // ========== Role Permission Management ==========
  createRole(request: CreateRoleRequest): Observable<CreateRoleResponse>;
  getRoles(request: GetRolesRequest): Observable<GetRolesResponse>;
  getPermissions(request: GetPermissionsRequest): Observable<GetPermissionsResponse>;
  updateRolePermissions(request: UpdateRolePermissionsRequest): Observable<UpdateRolePermissionsResponse>;
  deleteRole(request: DeleteRoleRequest): Observable<void>;

  // ========== Health Check ==========
  healthCheck(request: void): Observable<HealthCheckResponse>;
}

// User related type definitions
export interface User {
  id: string;
  enterpriseId: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  status: UserStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0,
  USER_STATUS_ACTIVE = 1,
  USER_STATUS_INACTIVE = 2,
  USER_STATUS_PENDING = 3,
  USER_STATUS_SUSPENDED = 4,
}

// Enterprise related type definitions
export interface Enterprise {
  id: string;
  name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  status: EnterpriseStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export enum EnterpriseStatus {
  ENTERPRISE_STATUS_UNSPECIFIED = 0,
  ENTERPRISE_STATUS_ACTIVE = 1,
  ENTERPRISE_STATUS_INACTIVE = 2,
  ENTERPRISE_STATUS_SUSPENDED = 3,
}

// Role permission related type definitions
export interface Role {
  id: number;
  enterpriseId: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// ========== Request/Response Type Definitions ==========

// User management request/response
export interface CreateUserRequest {
  enterpriseId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface CreateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

export interface FindUsersRequest {
  enterpriseId: string;
  page: number;
  limit: number;
  status?: UserStatus;
  email?: string;
  roleId?: number;
}

export interface FindUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
  message: string;
}

export interface UpdateUserRequest {
  userId: string;
  enterpriseId: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
}

export interface UpdateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

export interface DeleteUserRequest {
  userId: string;
  enterpriseId: string;
}

export interface UpdateUserStatusRequest {
  userId: string;
  enterpriseId: string;
  status: UserStatus;
}

export interface UpdateUserStatusResponse {
  user: User;
  success: boolean;
  message: string;
}

export interface ActivateUserRequest {
  userId: string;
  enterpriseId: string;
  activationToken: string;
}

export interface ActivateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

// Enterprise management request/response
export interface CreateEnterpriseRequest {
  name: string;
  description: string;
  website?: string;
  phone?: string;
  email: string;
  address?: string;
}

export interface CreateEnterpriseResponse {
  enterprise: Enterprise;
  success: boolean;
  message: string;
}

export interface QueryEnterpriseByIdRequest {
  enterpriseId: string;
}

export interface QueryEnterpriseByIdResponse {
  enterprise: Enterprise;
  success: boolean;
  message: string;
}

// Role permission management request/response
export interface CreateRoleRequest {
  enterpriseId: string;
  name: string;
  description: string;
  permissionIds: number[];
}

export interface CreateRoleResponse {
  role: Role;
  success: boolean;
  message: string;
}

export interface GetRolesRequest {
  enterpriseId: string;
  page: number;
  limit: number;
}

export interface GetRolesResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
  message: string;
}

export interface GetPermissionsRequest {
  page: number;
  limit: number;
  resource?: string;
}

export interface GetPermissionsResponse {
  permissions: Permission[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
  message: string;
}

export interface UpdateRolePermissionsRequest {
  roleId: number;
  enterpriseId: string;
  permissionIds: number[];
}

export interface UpdateRolePermissionsResponse {
  role: Role;
  success: boolean;
  message: string;
}

export interface DeleteRoleRequest {
  roleId: number;
  enterpriseId: string;
}
