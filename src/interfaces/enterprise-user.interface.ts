import { Observable } from 'rxjs';
import { Timestamp, HealthCheckResponse, PaginationRequest, PaginationResponse, BaseResponse } from '../types/common.types';

// 企业用户服务接口定义
export interface IEnterpriseUserService {
  // ========== 用户管理 ==========
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;
  findUsers(request: FindUsersRequest): Observable<FindUsersResponse>;
  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse>;
  deleteUser(request: DeleteUserRequest): Observable<void>;
  updateUserStatus(request: UpdateUserStatusRequest): Observable<UpdateUserStatusResponse>;
  activateUser(request: ActivateUserRequest): Observable<ActivateUserResponse>;

  // ========== 企业管理 ==========
  createEnterprise(request: CreateEnterpriseRequest): Observable<CreateEnterpriseResponse>;
  queryEnterpriseById(request: QueryEnterpriseByIdRequest): Observable<QueryEnterpriseByIdResponse>;

  // ========== 角色权限管理 ==========
  createRole(request: CreateRoleRequest): Observable<CreateRoleResponse>;
  getRoles(request: GetRolesRequest): Observable<GetRolesResponse>;
  getPermissions(request: GetPermissionsRequest): Observable<GetPermissionsResponse>;
  updateRolePermissions(request: UpdateRolePermissionsRequest): Observable<UpdateRolePermissionsResponse>;
  deleteRole(request: DeleteRoleRequest): Observable<void>;

  // ========== 健康检查 ==========
  healthCheck(request: void): Observable<HealthCheckResponse>;
}

// 用户相关类型定义
export interface User {
  id: string;
  enterprise_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  status: UserStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0,
  USER_STATUS_ACTIVE = 1,
  USER_STATUS_INACTIVE = 2,
  USER_STATUS_PENDING = 3,
  USER_STATUS_SUSPENDED = 4,
}

// 企业相关类型定义
export interface Enterprise {
  id: string;
  name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  status: EnterpriseStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export enum EnterpriseStatus {
  ENTERPRISE_STATUS_UNSPECIFIED = 0,
  ENTERPRISE_STATUS_ACTIVE = 1,
  ENTERPRISE_STATUS_INACTIVE = 2,
  ENTERPRISE_STATUS_SUSPENDED = 3,
}

// 角色权限相关类型定义
export interface Role {
  id: number;
  enterprise_id: string;
  name: string;
  description: string;
  permissions: Permission[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// ========== 请求/响应类型定义 ==========

// 用户管理请求/响应
export interface CreateUserRequest {
  enterprise_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface CreateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

export interface FindUsersRequest {
  enterprise_id: string;
  page: number;
  limit: number;
  status?: UserStatus;
  email?: string;
  role_id?: number;
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
  user_id: string;
  enterprise_id: string;
  first_name?: string;
  last_name?: string;
  role_id?: number;
}

export interface UpdateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

export interface DeleteUserRequest {
  user_id: string;
  enterprise_id: string;
}

export interface UpdateUserStatusRequest {
  user_id: string;
  enterprise_id: string;
  status: UserStatus;
}

export interface UpdateUserStatusResponse {
  user: User;
  success: boolean;
  message: string;
}

export interface ActivateUserRequest {
  user_id: string;
  enterprise_id: string;
  activation_token: string;
}

export interface ActivateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

// 企业管理请求/响应
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
  enterprise_id: string;
}

export interface QueryEnterpriseByIdResponse {
  enterprise: Enterprise;
  success: boolean;
  message: string;
}

// 角色权限管理请求/响应
export interface CreateRoleRequest {
  enterprise_id: string;
  name: string;
  description: string;
  permission_ids: number[];
}

export interface CreateRoleResponse {
  role: Role;
  success: boolean;
  message: string;
}

export interface GetRolesRequest {
  enterprise_id: string;
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
  role_id: number;
  enterprise_id: string;
  permission_ids: number[];
}

export interface UpdateRolePermissionsResponse {
  role: Role;
  success: boolean;
  message: string;
}

export interface DeleteRoleRequest {
  role_id: number;
  enterprise_id: string;
}
