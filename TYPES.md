# TypeScript 接口和类型定义文档

本文档详细说明了 `@alloyx/jupiter-grpc-protos` 包中提供的所有 TypeScript 接口和类型定义。

## 📋 概览

这个包提供了两层类型系统：

1. **自动生成的 Proto 类型** - 从 `.proto` 文件生成的原始类型
2. **TypeScript 服务接口** - 为 NestJS 和其他 TypeScript 项目优化的接口定义

## 🔧 服务接口

### IEnterpriseUserService

企业用户服务的 TypeScript 接口定义，包含所有用户、企业和角色权限管理的方法。

```typescript
interface IEnterpriseUserService {
  // 用户管理
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;
  findUsers(request: FindUsersRequest): Observable<FindUsersResponse>;
  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse>;
  deleteUser(request: DeleteUserRequest): Observable<void>;
  updateUserStatus(request: UpdateUserStatusRequest): Observable<UpdateUserStatusResponse>;
  activateUser(request: ActivateUserRequest): Observable<ActivateUserResponse>;

  // 企业管理
  createEnterprise(request: CreateEnterpriseRequest): Observable<CreateEnterpriseResponse>;
  queryEnterpriseById(request: QueryEnterpriseByIdRequest): Observable<QueryEnterpriseByIdResponse>;

  // 角色权限管理
  createRole(request: CreateRoleRequest): Observable<CreateRoleResponse>;
  getRoles(request: GetRolesRequest): Observable<GetRolesResponse>;
  getPermissions(request: GetPermissionsRequest): Observable<GetPermissionsResponse>;
  updateRolePermissions(
    request: UpdateRolePermissionsRequest
  ): Observable<UpdateRolePermissionsResponse>;
  deleteRole(request: DeleteRoleRequest): Observable<void>;

  // 健康检查
  healthCheck(request: void): Observable<HealthCheckResponse>;
}
```

### IWalletService

钱包服务的 TypeScript 接口定义，包含钱包和交易管理的所有方法。

```typescript
interface IWalletService {
  // 钱包管理
  createWallet(request: CreateWalletRequest): Observable<CreateWalletResponse>;
  getWallets(request: GetWalletsRequest): Observable<GetWalletsResponse>;
  getWalletById(request: GetWalletByIdRequest): Observable<GetWalletByIdResponse>;
  updateWallet(request: UpdateWalletRequest): Observable<UpdateWalletResponse>;
  deleteWallet(request: DeleteWalletRequest): Observable<void>;
  freezeWallet(request: FreezeWalletRequest): Observable<FreezeWalletResponse>;
  getWalletBalance(request: GetWalletBalanceRequest): Observable<GetWalletBalanceResponse>;

  // 交易管理
  createTransaction(request: CreateTransactionRequest): Observable<CreateTransactionResponse>;
  getTransactions(request: GetTransactionsRequest): Observable<GetTransactionsResponse>;
  getTransactionById(request: GetTransactionByIdRequest): Observable<GetTransactionByIdResponse>;
  getTransactionStatus(
    request: GetTransactionStatusRequest
  ): Observable<GetTransactionStatusResponse>;
  updateTransactionStatus(
    request: UpdateTransactionStatusRequest
  ): Observable<UpdateTransactionStatusResponse>;
  cancelTransaction(request: CancelTransactionRequest): Observable<CancelTransactionResponse>;
  getTransactionHistory(
    request: GetTransactionHistoryRequest
  ): Observable<GetTransactionHistoryResponse>;

  // 健康检查
  healthCheck(request: void): Observable<HealthCheckResponse>;
}
```

## 🏷️ 核心实体类型

### User

```typescript
interface User {
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
```

### Enterprise

```typescript
interface Enterprise {
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
```

### Wallet

```typescript
interface Wallet {
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
```

### Transaction

```typescript
interface Transaction {
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
```

## 🔢 枚举类型

### UserStatus

```typescript
enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0,
  USER_STATUS_ACTIVE = 1,
  USER_STATUS_INACTIVE = 2,
  USER_STATUS_PENDING = 3,
  USER_STATUS_SUSPENDED = 4,
}
```

### WalletType

```typescript
enum WalletType {
  WALLET_TYPE_UNSPECIFIED = 0,
  WALLET_TYPE_PERSONAL = 1,
  WALLET_TYPE_ENTERPRISE = 2,
  WALLET_TYPE_INVESTMENT = 3,
  WALLET_TYPE_SAVINGS = 4,
}
```

### TransactionType

```typescript
enum TransactionType {
  TRANSACTION_TYPE_UNSPECIFIED = 0,
  TRANSACTION_TYPE_DEPOSIT = 1,
  TRANSACTION_TYPE_WITHDRAWAL = 2,
  TRANSACTION_TYPE_TRANSFER = 3,
  TRANSACTION_TYPE_PAYMENT = 4,
  TRANSACTION_TYPE_REFUND = 5,
}
```

### TransactionStatus

```typescript
enum TransactionStatus {
  TRANSACTION_STATUS_UNSPECIFIED = 0,
  TRANSACTION_STATUS_PENDING = 1,
  TRANSACTION_STATUS_PROCESSING = 2,
  TRANSACTION_STATUS_COMPLETED = 3,
  TRANSACTION_STATUS_FAILED = 4,
  TRANSACTION_STATUS_CANCELLED = 5,
  TRANSACTION_STATUS_EXPIRED = 6,
}
```

## 📨 请求/响应类型示例

### 创建用户

```typescript
// 请求
interface CreateUserRequest {
  enterprise_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
}

// 响应
interface CreateUserResponse extends BaseResponse {
  user: User;
}
```

### 查询用户列表

```typescript
// 请求
interface FindUsersRequest extends PaginationRequest {
  enterprise_id: string;
  status?: UserStatus;
  email?: string;
  role_id?: number;
}

// 响应
interface FindUsersResponse extends PaginationResponse, BaseResponse {
  users: User[];
}
```

### 创建钱包

```typescript
// 请求
interface CreateWalletRequest {
  enterprise_id: string;
  customer_ref_id: string;
  wallet_name: string;
  user_id: string;
  wallet_type: WalletType;
  initial_currency?: string;
}

// 响应
interface CreateWalletResponse extends BaseResponse {
  wallet: Wallet;
}
```

### 创建交易

```typescript
// 请求
interface CreateTransactionRequest {
  from_wallet_id: string;
  to_wallet_id: string;
  transaction_type: TransactionType;
  amount: string;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

// 响应
interface CreateTransactionResponse extends BaseResponse {
  transaction: Transaction;
}
```

## 🧰 通用类型

### BaseResponse

```typescript
interface BaseResponse {
  success: boolean;
  message: string;
}
```

### PaginationRequest

```typescript
interface PaginationRequest {
  page: number;
  limit: number;
}
```

### PaginationResponse

```typescript
interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
}
```

### Timestamp

```typescript
interface Timestamp {
  seconds: number;
  nanos: number;
}
```

## 💡 使用提示

1. **导入类型**：从包中导入需要的类型和接口

   ```typescript
   import {
     IEnterpriseUserService,
     CreateUserRequest,
     UserStatus,
   } from '@alloyx/jupiter-grpc-protos';
   ```

2. **类型安全**：使用接口确保请求参数的类型安全

   ```typescript
   const request: CreateUserRequest = {
     enterprise_id: 'ent_123',
     first_name: '张',
     last_name: '三',
     email: 'zhangsan@example.com',
     password: 'password123',
     role_id: 1,
   };
   ```

3. **枚举使用**：使用预定义的枚举值

   ```typescript
   const status = UserStatus.USER_STATUS_ACTIVE;
   const walletType = WalletType.WALLET_TYPE_PERSONAL;
   ```

4. **异步处理**：所有服务方法返回 Observable，使用 `.toPromise()` 转换为 Promise
   ```typescript
   const response = await userService.createUser(request).toPromise();
   ```

这些类型定义确保了在开发过程中的类型安全，提供了完整的智能感知支持，并有助于减少运行时错误。
