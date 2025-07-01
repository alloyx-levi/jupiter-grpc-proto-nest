import { Observable } from 'rxjs';
import { HealthCheckResponse, BaseResponse, Timestamp } from '../types/common.types';

// Authentication service interface definition
export interface IAuthenticationService {
  // User authentication
  login(request: LoginRequest): Observable<LoginResponse>;
  logout(request: LogoutRequest): Observable<LogoutResponse>;
  validateToken(request: ValidateTokenRequest): Observable<ValidateTokenResponse>;

  // Password management
  checkPasswordStrength(request: PasswordStrengthRequest): Observable<PasswordStrengthResponse>;
  savePassword(request: SavePasswordRequest): Observable<SavePasswordResponse>;
  updatePassword(request: UpdatePasswordRequest): Observable<UpdatePasswordResponse>;
  deletePassword(request: DeletePasswordRequest): Observable<DeletePasswordResponse>;

  // Health check
  healthCheck(request: void): Observable<HealthCheckResponse>;
}

// Auth user status enum
export enum AuthUserStatus {
  USER_STATUS_UNSPECIFIED = 0,
  USER_STATUS_ACTIVE = 1,
  USER_STATUS_INACTIVE = 2,
  USER_STATUS_PENDING = 3,
  USER_STATUS_SUSPENDED = 4,
}

// KYB status enum
export enum KybStatus {
  KYB_STATUS_UNSPECIFIED = 0,
  KYB_STATUS_PENDING = 1,
  KYB_STATUS_APPROVED = 2,
  KYB_STATUS_REJECTED = 3,
  KYB_STATUS_UNDER_REVIEW = 4,
}

// KYC status enum
export enum KycStatus {
  KYC_STATUS_UNSPECIFIED = 0,
  KYC_STATUS_PENDING = 1,
  KYC_STATUS_APPROVED = 2,
  KYC_STATUS_REJECTED = 3,
  KYC_STATUS_UNDER_REVIEW = 4,
}

// User data model for authentication
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
  enterpriseId?: string;
  status: AuthUserStatus;
  kybStatus: KybStatus;
  kycStatus: KycStatus;
  lastLoginAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Login request and response
export interface LoginRequest {
  enterpriseId?: string;
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
}

export interface LoginResponse extends BaseResponse<LoginData> { }

export interface LoginData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Logout request and response
export interface LogoutRequest {
  accessToken: string;
  refreshToken?: string;
}

export interface LogoutResponse extends BaseResponse<void> { }

// Validate token request and response
export interface ValidateTokenRequest {
  accessToken: string;
}

export interface ValidateTokenResponse extends BaseResponse<ValidateTokenData> { }

export interface ValidateTokenData {
  valid: boolean;
  user?: AuthUser;
  expiresIn?: number;
}

// Password strength request and response
export interface PasswordStrengthRequest {
  password: string;
}

export interface PasswordStrengthResponse extends BaseResponse<PasswordStrengthData> { }

export interface PasswordStrengthData {
  score: number;
  strength: string;
  feedback: string[];
  passed: boolean;
}

// Save password request and response
export interface SavePasswordRequest {
  userId: string;
  password: string;
  confirmPassword: string;
}

export interface SavePasswordResponse extends BaseResponse<void> { }

// Update password request and response
export interface UpdatePasswordRequest {
  email: string;
  password: string;
}

export interface UpdatePasswordResponse extends BaseResponse<void> { }

// Delete password request and response
export interface DeletePasswordRequest {
  userId: string;
  currentPassword: string;
}

export interface DeletePasswordResponse extends BaseResponse<void> { }
