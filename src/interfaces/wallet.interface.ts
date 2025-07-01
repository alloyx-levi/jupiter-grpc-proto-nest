import { Observable } from 'rxjs';
import { Timestamp, HealthCheckResponse, PaginationRequest, PaginationResponse, BaseResponse } from '../types/common.types';

// Wallet service interface definition
export interface IWalletService {
  // ========== Wallet Management ==========
  createWallet(request: CreateWalletRequest): Observable<CreateWalletResponse>;
  getWallets(request: GetWalletsRequest): Observable<GetWalletsResponse>;
  getWalletById(request: GetWalletByIdRequest): Observable<GetWalletByIdResponse>;
  updateWallet(request: UpdateWalletRequest): Observable<UpdateWalletResponse>;
  deleteWallet(request: DeleteWalletRequest): Observable<void>;
  freezeWallet(request: FreezeWalletRequest): Observable<FreezeWalletResponse>;
  getWalletBalance(request: GetWalletBalanceRequest): Observable<GetWalletBalanceResponse>;

  // ========== Transaction Management ==========
  createTransaction(request: CreateTransactionRequest): Observable<CreateTransactionResponse>;
  getTransactions(request: GetTransactionsRequest): Observable<GetTransactionsResponse>;
  getTransactionById(request: GetTransactionByIdRequest): Observable<GetTransactionByIdResponse>;
  getTransactionStatus(request: GetTransactionStatusRequest): Observable<GetTransactionStatusResponse>;
  updateTransactionStatus(request: UpdateTransactionStatusRequest): Observable<UpdateTransactionStatusResponse>;
  cancelTransaction(request: CancelTransactionRequest): Observable<CancelTransactionResponse>;
  getTransactionHistory(request: GetTransactionHistoryRequest): Observable<GetTransactionHistoryResponse>;

  // ========== Health Check ==========
  healthCheck(request: void): Observable<HealthCheckResponse>;
}

// Wallet related type definitions
export interface Wallet {
  id: string;
  enterpriseId: string;
  customerRefId: string;
  walletName: string;
  userId: string;
  walletType: WalletType;
  status: WalletStatus;
  balances: Balance[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  availableAmount: string;
  pendingAmount: string;
  frozenAmount: string;
  totalAmount: string;
  lastUpdated: Timestamp;
}

// Transaction related type definitions
export interface Transaction {
  id: string;
  walletId: string;
  fromWalletId: string;
  toWalletId: string;
  transactionType: TransactionType;
  amount: string;
  currency: string;
  fee: string;
  description: string;
  status: TransactionStatus;
  metadata: Record<string, string>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
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

// ========== Wallet Management Request/Response Type Definitions ==========

export interface CreateWalletRequest {
  enterpriseId: string;
  customerRefId: string;
  walletName: string;
  userId: string;
  walletType: WalletType;
  initialCurrency?: string;
}

export interface CreateWalletResponse extends BaseResponse {
  wallet: Wallet;
}

export interface GetWalletsRequest extends PaginationRequest {
  enterpriseId: string;
  userId?: string;
  walletType?: WalletType;
  status?: WalletStatus;
}

export interface GetWalletsResponse extends PaginationResponse, BaseResponse {
  wallets: Wallet[];
}

export interface GetWalletByIdRequest {
  walletId: string;
  enterpriseId: string;
}

export interface GetWalletByIdResponse extends BaseResponse {
  wallet: Wallet;
}

export interface UpdateWalletRequest {
  walletId: string;
  enterpriseId: string;
  walletName?: string;
  status?: WalletStatus;
}

export interface UpdateWalletResponse extends BaseResponse {
  wallet: Wallet;
}

export interface DeleteWalletRequest {
  walletId: string;
  enterpriseId: string;
}

export interface FreezeWalletRequest {
  walletId: string;
  enterpriseId: string;
  reason: string;
}

export interface FreezeWalletResponse extends BaseResponse {
  wallet: Wallet;
}

export interface GetWalletBalanceRequest {
  walletId: string;
  enterpriseId: string;
  currency?: string;
}

export interface GetWalletBalanceResponse extends BaseResponse {
  balances: Balance[];
}

// ========== Transaction Management Request/Response Type Definitions ==========

export interface CreateTransactionRequest {
  fromWalletId: string;
  toWalletId: string;
  transactionType: TransactionType;
  amount: string;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface CreateTransactionResponse extends BaseResponse {
  transaction: Transaction;
}

export interface GetTransactionsRequest extends PaginationRequest {
  walletId?: string;
  enterpriseId: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  currency?: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
}

export interface GetTransactionsResponse extends PaginationResponse, BaseResponse {
  transactions: Transaction[];
}

export interface GetTransactionByIdRequest {
  transactionId: string;
  enterpriseId: string;
}

export interface GetTransactionByIdResponse extends BaseResponse {
  transaction: Transaction;
}

export interface GetTransactionStatusRequest {
  transactionId: string;
  enterpriseId: string;
}

export interface GetTransactionStatusResponse extends BaseResponse {
  status: TransactionStatus;
  updatedAt: Timestamp;
}

export interface UpdateTransactionStatusRequest {
  transactionId: string;
  enterpriseId: string;
  status: TransactionStatus;
  reason?: string;
}

export interface UpdateTransactionStatusResponse extends BaseResponse {
  transaction: Transaction;
}

export interface CancelTransactionRequest {
  transactionId: string;
  enterpriseId: string;
  reason: string;
}

export interface CancelTransactionResponse extends BaseResponse {
  transaction: Transaction;
}

export interface GetTransactionHistoryRequest extends PaginationRequest {
  walletId: string;
  enterpriseId: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  transactionType?: TransactionType;
}

export interface GetTransactionHistoryResponse extends PaginationResponse, BaseResponse {
  transactions: Transaction[];
}
