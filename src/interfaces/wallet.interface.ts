import { Observable } from 'rxjs';
import { Timestamp, HealthCheckResponse, PaginationRequest, PaginationResponse, BaseResponse } from '../types/common.types';

// 钱包服务接口定义
export interface IWalletService {
  // ========== 钱包管理 ==========
  createWallet(request: CreateWalletRequest): Observable<CreateWalletResponse>;
  getWallets(request: GetWalletsRequest): Observable<GetWalletsResponse>;
  getWalletById(request: GetWalletByIdRequest): Observable<GetWalletByIdResponse>;
  updateWallet(request: UpdateWalletRequest): Observable<UpdateWalletResponse>;
  deleteWallet(request: DeleteWalletRequest): Observable<void>;
  freezeWallet(request: FreezeWalletRequest): Observable<FreezeWalletResponse>;
  getWalletBalance(request: GetWalletBalanceRequest): Observable<GetWalletBalanceResponse>;

  // ========== 交易管理 ==========
  createTransaction(request: CreateTransactionRequest): Observable<CreateTransactionResponse>;
  getTransactions(request: GetTransactionsRequest): Observable<GetTransactionsResponse>;
  getTransactionById(request: GetTransactionByIdRequest): Observable<GetTransactionByIdResponse>;
  getTransactionStatus(request: GetTransactionStatusRequest): Observable<GetTransactionStatusResponse>;
  updateTransactionStatus(request: UpdateTransactionStatusRequest): Observable<UpdateTransactionStatusResponse>;
  cancelTransaction(request: CancelTransactionRequest): Observable<CancelTransactionResponse>;
  getTransactionHistory(request: GetTransactionHistoryRequest): Observable<GetTransactionHistoryResponse>;

  // ========== 健康检查 ==========
  healthCheck(request: void): Observable<HealthCheckResponse>;
}

// 钱包相关类型定义
export interface Wallet {
  id: string;
  enterprise_id: string;
  customer_ref_id: string;
  wallet_name: string;
  user_id: string;
  wallet_type: WalletType;
  status: WalletStatus;
  balances: Balance[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export enum WalletType {
  WALLET_TYPE_UNSPECIFIED = 0,
  WALLET_TYPE_PERSONAL = 1,
  WALLET_TYPE_ENTERPRISE = 2,
  WALLET_TYPE_INVESTMENT = 3,
  WALLET_TYPE_SAVINGS = 4,
}

export enum WalletStatus {
  WALLET_STATUS_UNSPECIFIED = 0,
  WALLET_STATUS_ACTIVE = 1,
  WALLET_STATUS_INACTIVE = 2,
  WALLET_STATUS_FROZEN = 3,
  WALLET_STATUS_SUSPENDED = 4,
  WALLET_STATUS_CLOSED = 5,
}

export interface Balance {
  currency: string;
  available_amount: string;
  pending_amount: string;
  frozen_amount: string;
  total_amount: string;
  last_updated: Timestamp;
}

// 交易相关类型定义
export interface Transaction {
  id: string;
  wallet_id: string;
  from_wallet_id: string;
  to_wallet_id: string;
  transaction_type: TransactionType;
  amount: string;
  currency: string;
  fee: string;
  description: string;
  status: TransactionStatus;
  metadata: Record<string, string>;
  created_at: Timestamp;
  updated_at: Timestamp;
  completed_at?: Timestamp;
}

export enum TransactionType {
  TRANSACTION_TYPE_UNSPECIFIED = 0,
  TRANSACTION_TYPE_DEPOSIT = 1,
  TRANSACTION_TYPE_WITHDRAWAL = 2,
  TRANSACTION_TYPE_TRANSFER = 3,
  TRANSACTION_TYPE_PAYMENT = 4,
  TRANSACTION_TYPE_REFUND = 5,
}

export enum TransactionStatus {
  TRANSACTION_STATUS_UNSPECIFIED = 0,
  TRANSACTION_STATUS_PENDING = 1,
  TRANSACTION_STATUS_PROCESSING = 2,
  TRANSACTION_STATUS_COMPLETED = 3,
  TRANSACTION_STATUS_FAILED = 4,
  TRANSACTION_STATUS_CANCELLED = 5,
  TRANSACTION_STATUS_EXPIRED = 6,
}

// ========== 钱包管理请求/响应类型定义 ==========

export interface CreateWalletRequest {
  enterprise_id: string;
  customer_ref_id: string;
  wallet_name: string;
  user_id: string;
  wallet_type: WalletType;
  initial_currency?: string;
}

export interface CreateWalletResponse extends BaseResponse {
  wallet: Wallet;
}

export interface GetWalletsRequest extends PaginationRequest {
  enterprise_id: string;
  user_id?: string;
  wallet_type?: WalletType;
  status?: WalletStatus;
}

export interface GetWalletsResponse extends PaginationResponse, BaseResponse {
  wallets: Wallet[];
}

export interface GetWalletByIdRequest {
  wallet_id: string;
  enterprise_id: string;
}

export interface GetWalletByIdResponse extends BaseResponse {
  wallet: Wallet;
}

export interface UpdateWalletRequest {
  wallet_id: string;
  enterprise_id: string;
  wallet_name?: string;
  status?: WalletStatus;
}

export interface UpdateWalletResponse extends BaseResponse {
  wallet: Wallet;
}

export interface DeleteWalletRequest {
  wallet_id: string;
  enterprise_id: string;
}

export interface FreezeWalletRequest {
  wallet_id: string;
  enterprise_id: string;
  reason: string;
}

export interface FreezeWalletResponse extends BaseResponse {
  wallet: Wallet;
}

export interface GetWalletBalanceRequest {
  wallet_id: string;
  enterprise_id: string;
  currency?: string;
}

export interface GetWalletBalanceResponse extends BaseResponse {
  balances: Balance[];
}

// ========== 交易管理请求/响应类型定义 ==========

export interface CreateTransactionRequest {
  from_wallet_id: string;
  to_wallet_id: string;
  transaction_type: TransactionType;
  amount: string;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface CreateTransactionResponse extends BaseResponse {
  transaction: Transaction;
}

export interface GetTransactionsRequest extends PaginationRequest {
  wallet_id?: string;
  enterprise_id: string;
  transaction_type?: TransactionType;
  status?: TransactionStatus;
  currency?: string;
  start_date?: Timestamp;
  end_date?: Timestamp;
}

export interface GetTransactionsResponse extends PaginationResponse, BaseResponse {
  transactions: Transaction[];
}

export interface GetTransactionByIdRequest {
  transaction_id: string;
  enterprise_id: string;
}

export interface GetTransactionByIdResponse extends BaseResponse {
  transaction: Transaction;
}

export interface GetTransactionStatusRequest {
  transaction_id: string;
  enterprise_id: string;
}

export interface GetTransactionStatusResponse extends BaseResponse {
  status: TransactionStatus;
  updated_at: Timestamp;
}

export interface UpdateTransactionStatusRequest {
  transaction_id: string;
  enterprise_id: string;
  status: TransactionStatus;
  reason?: string;
}

export interface UpdateTransactionStatusResponse extends BaseResponse {
  transaction: Transaction;
}

export interface CancelTransactionRequest {
  transaction_id: string;
  enterprise_id: string;
  reason: string;
}

export interface CancelTransactionResponse extends BaseResponse {
  transaction: Transaction;
}

export interface GetTransactionHistoryRequest extends PaginationRequest {
  wallet_id: string;
  enterprise_id: string;
  start_date?: Timestamp;
  end_date?: Timestamp;
  transaction_type?: TransactionType;
}

export interface GetTransactionHistoryResponse extends PaginationResponse, BaseResponse {
  transactions: Transaction[];
}
