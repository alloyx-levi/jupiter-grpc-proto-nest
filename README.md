# Jupiter gRPC Proto Repository

[![GitHub release](https://img.shields.io/github/release/AlloyXGroup/jupiter-grpc-proto-nest.svg)](https://github.com/AlloyXGroup/jupiter-grpc-proto-nest/releases)
[![npm version](https://img.shields.io/npm/v/@AlloyXGroup/jupiter-grpc-protos.svg)](https://www.npmjs.com/package/@AlloyXGroup/jupiter-grpc-protos)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![gRPC](https://img.shields.io/badge/gRPC-1.24+-green.svg)](https://grpc.io/)

統一管理 Jupiter 微服務架構的 gRPC proto 文件儲存庫，提供完整的 TypeScript 型別定義和客戶端封裝，透過 GitHub Packages 進行版本控制和發布。

## ✨ 主要特色

- 🎯 **完整型別支援**：提供完整的 TypeScript 介面定義
- 🚀 **Promise 包裝器**：內建 Promise 包裝，無需手動調用 `.toPromise()`
- 📦 **版本管理**：透過 GitHub Packages 統一版本控制
- 🔄 **自動更新**：CI/CD 自動化建置和發布流程
- 🛡️ **Swagger 同步**：與 OpenAPI 規範完全同步
- 🌐 **多服務支援**：支援認證、授權、用戶、錢包四大核心服務

## 🏗️ 支援的服務

| 服務名稱                           | 版本 | 描述                         | 狀態      |
| ---------------------------------- | ---- | ---------------------------- | --------- |
| **認證服務** (Authentication)      | v1   | 用戶登入、登出、令牌驗證     | ✅ 已支持 |
| **授權服務** (Authorization)       | v1   | 權限管理、存取控制           | ✅ 已支持 |
| **企業用戶服務** (Enterprise User) | v1   | 用戶管理、企業管理、角色權限 | ✅ 已支持 |
| **錢包服務** (Wallet)              | v1   | 錢包管理、交易處理、餘額查詢 | ✅ 已支持 |

## 📁 專案結構

```
jupiter-grpc-proto-nest/
├── protos/                          # Proto 檔案原始碼
│   ├── common/
│   │   └── v1/
│   │       └── common.proto
│   ├── enterprise-user/
│   │   └── v1/
│   │       └── enterprise_user.proto
│   ├── wallet/
│   │   └── v1/
│   │       └── wallet.proto
│   ├── authentication/
│   │   └── v1/
│   │       └── authentication.proto
│   └── authorization/
│       └── v1/
│           └── authorization.proto
├── generated/                       # 自動產生的程式碼
│   ├── common/
│   ├── enterprise-user/
│   ├── wallet/
│   ├── authentication/
│   └── authorization/
├── src/                            # TypeScript 原始碼
│   ├── clients/                    # gRPC 客戶端封裝
│   ├── interfaces/                 # TypeScript 介面定義
│   ├── types/                      # 型別定義
│   └── utils/                      # 工具函數
├── dist/                           # 編譯後的檔案
├── package.json                    # 套件設定
├── tsconfig.json                   # TypeScript 設定
└── .github/workflows/              # CI/CD 設定
    └── build-and-publish.yml
```

## 🚀 快速開始

### 系統需求

- Node.js 16.x 或更高版本
- npm 8.x 或 yarn 1.22+
- TypeScript 5.0+

### 1. 安裝套件

```bash
# 從 GitHub Packages 安裝
npm install @AlloyXGroup/jupiter-grpc-protos

# 或者使用 yarn
yarn add @AlloyXGroup/jupiter-grpc-protos
```

### 2. 設定 GitHub Packages 認證

在專案根目錄建立 `.npmrc` 檔案：

```bash
@AlloyXGroup:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

### 3. 基本使用範例

```typescript
import {
  createAuthenticationServiceClient,
  IAuthenticationService,
  LoginRequest,
  LoginResponse,
} from '@AlloyXGroup/jupiter-grpc-protos';

// 建立客戶端
const authClient = createAuthenticationServiceClient('localhost:50051');

// 執行登入
const loginRequest: LoginRequest = {
  email: 'user@example.com',
  password: 'password123',
  enterpriseId: 'ent_123', // 可選
};

const response: LoginResponse = await authClient.login(loginRequest);
console.log('登入成功:', response.token);
```

## 🔧 NestJS 微服務整合

### 完整的微服務設定

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_ENDPOINTS } from '@AlloyXGroup/jupiter-grpc-protos';

@Module({
  imports: [
    ClientsModule.register([
      // 認證服務
      {
        name: 'AUTHENTICATION_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'authentication.v1',
          protoPath: require.resolve(
            '@AlloyXGroup/jupiter-grpc-protos/protos/authentication/v1/authentication.proto'
          ),
          url: SERVICE_ENDPOINTS.AUTHENTICATION,
        },
      },
      // 授權服務
      {
        name: 'AUTHORIZATION_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'authorization.v1',
          protoPath: require.resolve(
            '@AlloyXGroup/jupiter-grpc-protos/protos/authorization/v1/authorization.proto'
          ),
          url: SERVICE_ENDPOINTS.AUTHORIZATION,
        },
      },
      // 企業用戶服務
      {
        name: 'ENTERPRISE_USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'enterprise_user.v1',
          protoPath: require.resolve(
            '@AlloyXGroup/jupiter-grpc-protos/protos/enterprise-user/v1/enterprise_user.proto'
          ),
          url: SERVICE_ENDPOINTS.ENTERPRISE_USER,
        },
      },
      // 錢包服務
      {
        name: 'WALLET_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'wallet.v1',
          protoPath: require.resolve(
            '@AlloyXGroup/jupiter-grpc-protos/protos/wallet/v1/wallet.proto'
          ),
          url: SERVICE_ENDPOINTS.WALLET,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

### 服務使用範例

```typescript
// auth.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IAuthenticationService,
  IAuthenticationServicePromise,
  LoginRequest,
  LoginResponse,
  GrpcClientWrapper,
} from '@AlloyXGroup/jupiter-grpc-protos';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: IAuthenticationServicePromise;

  constructor(@Inject('AUTHENTICATION_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // 先獲取原始服務
    const originalAuthService =
      this.client.getService<IAuthenticationService>('AuthenticationService');

    // 使用 Promise 包裝器，自動轉換 Observable 為 Promise
    this.authService = GrpcClientWrapper.wrapService(originalAuthService);
  }

  async login(email: string, password: string, enterpriseId?: string): Promise<LoginResponse> {
    const request: LoginRequest = {
      email,
      password,
      enterpriseId, // 可選參數
    };

    // 直接返回 Promise，無需 .toPromise()
    return this.authService.login(request);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.authService.validateToken({ token });
      return response.valid;
    } catch (error) {
      return false;
    }
  }
}
```

### 所有服務的完整範例

```typescript
// comprehensive-service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  GrpcClientWrapper,
  IAuthenticationService,
  IAuthorizationService,
  IEnterpriseUserService,
  IWalletService,
  IAuthenticationServicePromise,
  IAuthorizationServicePromise,
  IEnterpriseUserServicePromise,
  IWalletServicePromise,
} from '@AlloyXGroup/jupiter-grpc-protos';

@Injectable()
export class ComprehensiveService implements OnModuleInit {
  private authService: IAuthenticationServicePromise;
  private authzService: IAuthorizationServicePromise;
  private userService: IEnterpriseUserServicePromise;
  private walletService: IWalletServicePromise;

  constructor(
    @Inject('AUTHENTICATION_SERVICE') private authClient: ClientGrpc,
    @Inject('AUTHORIZATION_SERVICE') private authzClient: ClientGrpc,
    @Inject('ENTERPRISE_USER_SERVICE') private userClient: ClientGrpc,
    @Inject('WALLET_SERVICE') private walletClient: ClientGrpc
  ) {}

  onModuleInit() {
    // 獲取並包裝認證服務
    const originalAuthService =
      this.authClient.getService<IAuthenticationService>('AuthenticationService');
    this.authService = GrpcClientWrapper.wrapService(originalAuthService);

    // 獲取並包裝授權服務
    const originalAuthzService =
      this.authzClient.getService<IAuthorizationService>('AuthorizationService');
    this.authzService = GrpcClientWrapper.wrapService(originalAuthzService);

    // 獲取並包裝企業用戶服務
    const originalUserService =
      this.userClient.getService<IEnterpriseUserService>('EnterpriseUserService');
    this.userService = GrpcClientWrapper.wrapService(originalUserService);

    // 獲取並包裝錢包服務
    const originalWalletService = this.walletClient.getService<IWalletService>('WalletService');
    this.walletService = GrpcClientWrapper.wrapService(originalWalletService);
  }

  // 現在所有服務都可以直接使用 Promise，無需 .toPromise()
  async performCompleteUserFlow(userData: any) {
    // 1. 創建用戶
    const user = await this.userService.createUser(userData);

    // 2. 創建錢包
    const wallet = await this.walletService.createWallet({
      enterpriseId: user.enterpriseId,
      userId: user.userId,
      // ...其他參數
    });

    // 3. 設置權限
    await this.authzService.setPermission({
      userId: user.userId,
      permission: 'WALLET_ACCESS',
      resourceId: wallet.walletId,
    });

    return { user, wallet };
  }
}
```

## 📚 API 使用指南

### 認證服務 (Authentication Service)

```typescript
import {
  IAuthenticationServicePromise,
  LoginRequest,
  UpdatePasswordRequest,
  ValidateTokenRequest,
} from '@AlloyXGroup/jupiter-grpc-protos';

// 用戶登入
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123',
  enterpriseId: 'ent_123', // 可選
});

// 驗證令牌
const tokenValid = await authService.validateToken({
  token: 'jwt_token_here',
});

// 更新密碼
await authService.updatePassword({
  newPassword: 'new_password123',
});

// 用戶登出
await authService.logout({
  token: 'jwt_token_here',
});
```

### 授權服務 (Authorization Service)

```typescript
import {
  IAuthorizationServicePromise,
  CheckPermissionRequest,
  GetTransactionRecordsRequest,
} from '@AlloyXGroup/jupiter-grpc-protos';

// 檢查權限
const hasPermission = await authzService.checkPermission({
  userId: 'user_123',
  permission: 'READ_WALLET',
  resourceId: 'wallet_456',
});

// 獲取交易記錄
const records = await authzService.getTransactionRecords({
  userId: 'user_123',
  limit: 10,
  offset: 0,
});
```

### 企業用戶服務 (Enterprise User Service)

```typescript
import {
  IEnterpriseUserServicePromise,
  CreateUserRequest,
  UpdateUserRequest,
  UserStatus,
} from '@AlloyXGroup/jupiter-grpc-protos';

// 建立用戶
const newUser = await userService.createUser({
  enterpriseId: 'ent_123',
  firstName: '張',
  lastName: '三',
  email: 'zhangsan@example.com',
  password: 'password123',
  roleId: 1,
});

// 更新用戶
await userService.updateUser({
  userId: 'user_123',
  firstName: '李',
  lastName: '四',
  status: UserStatus.USER_STATUS_ACTIVE,
});

// 獲取用戶詳情
const userDetail = await userService.getUserById({
  userId: 'user_123',
});
```

### 錢包服務 (Wallet Service)

```typescript
import {
  IWalletServicePromise,
  CreateWalletRequest,
  TransferRequest,
  WalletType,
  TransactionType,
} from '@AlloyXGroup/jupiter-grpc-protos';

// 建立錢包
const newWallet = await walletService.createWallet({
  enterpriseId: 'ent_123',
  customerRefId: 'cust_456',
  walletName: '主錢包',
  userId: 'user_789',
  walletType: WalletType.WALLET_TYPE_PERSONAL,
  supportedCurrencies: ['USD', 'TWD'],
});

// 轉帳
const transferResult = await walletService.transfer({
  fromWalletId: 'wallet_123',
  toWalletId: 'wallet_456',
  amount: '100.00',
  currency: 'USD',
  transactionType: TransactionType.TRANSACTION_TYPE_TRANSFER,
});

// 查詢餘額
const balance = await walletService.getBalance({
  walletId: 'wallet_123',
  currency: 'USD',
});
```

## 🎯 Promise 包裝器

為了提供更好的開發體驗，這個套件內建了 Promise 包裝器，讓你無需每次都手動呼叫 `.toPromise()`。

### 基本概念

```typescript
// ❌ 傳統方式：需要手動調用 .toPromise()
const response = await userService.createUser(request).toPromise();

// ✅ 使用 Promise 包裝器：直接使用 await
const response = await userService.createUser(request);
```

### 重要說明

`GrpcClientWrapper.wrapService` 接受一個參數：

- **輸入**：原始的 gRPC 服務實例（Observable 介面）
- **輸出**：包裝後的服務實例（Promise 介面）

```typescript
const originalService = client.getService<IAuthenticationService>('AuthenticationService');
const promiseService = GrpcClientWrapper.wrapService(originalService);
```

### 型別對比

```typescript
// 原始 Observable 介面
interface IEnterpriseUserService {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;
}

// Promise 包裝後的介面
interface IEnterpriseUserServicePromise {
  createUser(request: CreateUserRequest): Promise<CreateUserResponse>;
}
```

### 使用方法

```typescript
import {
  GrpcClientWrapper,
  IAuthenticationService,
  IAuthenticationServicePromise,
} from '@AlloyXGroup/jupiter-grpc-protos';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: IAuthenticationServicePromise;

  constructor(@Inject('AUTHENTICATION_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // 1. 先獲取原始的 gRPC 服務
    const originalAuthService =
      this.client.getService<IAuthenticationService>('AuthenticationService');

    // 2. 使用包裝器轉換為 Promise 介面
    this.authService = GrpcClientWrapper.wrapService(originalAuthService);
  }

  async login(email: string, password: string) {
    // 直接使用 await，無需 .toPromise()
    return this.authService.login({ email, password });
  }
}
```

## 🔢 型別定義與列舉

### 用戶狀態 (UserStatus)

```typescript
enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0,
  USER_STATUS_ACTIVE = 1,
  USER_STATUS_INACTIVE = 2,
  USER_STATUS_PENDING = 3,
  USER_STATUS_SUSPENDED = 4,
}
```

### 認證用戶狀態 (AuthUserStatus)

```typescript
enum AuthUserStatus {
  AUTH_USER_STATUS_UNSPECIFIED = 0,
  AUTH_USER_STATUS_ACTIVE = 1,
  AUTH_USER_STATUS_INACTIVE = 2,
}
```

### 錢包類型 (WalletType)

```typescript
enum WalletType {
  WALLET_TYPE_UNSPECIFIED = 0,
  WALLET_TYPE_PERSONAL = 1,
  WALLET_TYPE_ENTERPRISE = 2,
  WALLET_TYPE_INVESTMENT = 3,
  WALLET_TYPE_SAVINGS = 4,
}
```

### 交易類型 (TransactionType)

```typescript
enum TransactionType {
  TRANSACTION_TYPE_UNSPECIFIED = 0,
  TRANSACTION_TYPE_DEPOSIT = 1,
  TRANSACTION_TYPE_WITHDRAWAL = 2,
  TRANSACTION_TYPE_TRANSFER = 3,
  TRANSACTION_TYPE_PAYMENT = 4,
}
```

### KYB/KYC 狀態

```typescript
enum KybStatus {
  KYB_STATUS_UNSPECIFIED = 0,
  KYB_STATUS_PENDING = 1,
  KYB_STATUS_APPROVED = 2,
  KYB_STATUS_REJECTED = 3,
}

enum KycStatus {
  KYC_STATUS_UNSPECIFIED = 0,
  KYC_STATUS_PENDING = 1,
  KYC_STATUS_APPROVED = 2,
  KYC_STATUS_REJECTED = 3,
}
```

## 🛠 開發流程

### 1. 新增新的 Proto 檔案

1. 在 `protos/` 目錄下建立新的服務檔案
2. 更新 `package.json` 中的產生腳本
3. 在 `src/clients/` 中新增對應的客戶端封裝
4. 更新 `index.ts` 匯出新的客戶端

### 2. 本機開發

```bash
# 安裝相依性
npm install

# 產生 proto 檔案
npm run generate:proto

# 建置 TypeScript
npm run build:ts

# 完整建置
npm run build
```

### 3. 版本發布

#### 自動發布（推薦）

```bash
# 發布修補版本
npm run release:patch

# 發布次要版本
npm run release:minor

# 發布主要版本
npm run release:major
```

#### 手動發布

```bash
# 建置
npm run build

# 發布到 GitHub Packages
npm publish
```

## 📝 Proto 檔案規範

### 1. 檔案命名規範

- 使用小寫字母和底線
- 檔案名稱應描述服務功能
- 例：`enterprise_user.proto`, `wallet.proto`, `authentication.proto`

### 2. 套件命名規範

```protobuf
package service_name.v1;
option go_package = "github.com/alloyx/jupiter-grpc-protos/service-name/v1";
```

### 3. 訊息命名規範

- 使用 PascalCase
- Request/Response 後綴
- 例：`CreateUserRequest`, `CreateUserResponse`

### 4. 服務命名規範

- 使用 PascalCase
- Service 後綴
- 例：`EnterpriseUserService`, `WalletService`, `AuthenticationService`

## 🔧 設定說明

### GitHub Packages 設定

在 `package.json` 中設定：

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "@AlloyXGroup:registry": "https://npm.pkg.github.com"
  }
}
```

### CI/CD 設定

GitHub Actions 會自動：

1. 在 PR 和推送時進行程式碼檢查
2. 產生 proto 檔案和 TypeScript 程式碼
3. 在推送標籤時發布套件
4. 建立 GitHub Release

## 📋 可用腳本

```bash
npm run build              # 完整建置流程
npm run generate:proto     # 產生 proto 檔案
npm run build:ts          # 建置 TypeScript
npm run clean             # 清理產生的檔案
npm run lint              # 程式碼檢查
npm run format            # 程式碼格式化
npm run test              # 執行測試
npm run release:patch     # 發布修補版本
npm run release:minor     # 發布次要版本
npm run release:major     # 發布主要版本
```

## 📦 套件內容

發布的套件包含：

- `protos/`: 原始 proto 檔案
- `generated/`: 產生的 JavaScript/TypeScript 程式碼
- `dist/`: 編譯後的 TypeScript 程式碼
- 型別定義檔案

## 🤝 貢獻指南

1. Fork 本儲存庫
2. 建立功能分支
3. 提交更改
4. 建立 Pull Request

## 📄 授權條款

MIT License

## 🆘 故障排除

### 常見問題與解決方案

#### 1. 套件安裝失敗

**問題**：無法從 GitHub Packages 安裝套件

**解決方案**：

```bash
# 確保已設定 GitHub Packages 認證
npm login --scope=@AlloyXGroup --registry=https://npm.pkg.github.com

# 檢查 .npmrc 設定
cat .npmrc
```

#### 2. Proto 產生失敗

**問題**：執行 `npm run generate:proto` 失敗

**解決方案**：

```bash
# 安裝必要的工具
npm install -g grpc-tools

# 確認 protoc 版本
protoc --version

# 清理後重新產生
npm run clean
npm run generate:proto
```

#### 3. TypeScript 型別錯誤

**問題**：TypeScript 編譯時出現型別錯誤

**解決方案**：

```bash
# 安裝所有型別相依性
npm install @types/node @grpc/grpc-js google-protobuf

# 檢查 tsconfig.json 設定
npm run build:ts
```

#### 4. gRPC 連線失敗

**問題**：無法連接到 gRPC 服務

**解決方案**：

```typescript
// 檢查服務端點設定
import { SERVICE_ENDPOINTS } from '@AlloyXGroup/jupiter-grpc-protos';
console.log('服務端點:', SERVICE_ENDPOINTS);

// 確認服務狀態
const client = createAuthenticationServiceClient(SERVICE_ENDPOINTS.AUTHENTICATION);
// 使用健康檢查方法
```

#### 5. Promise 包裝器問題

**問題**：使用 Promise 包裝器時出現錯誤

**解決方案**：

```typescript
// 確保正確初始化
import { GrpcClientWrapper } from '@AlloyXGroup/jupiter-grpc-protos';

// 在 OnModuleInit 中設定
onModuleInit() {
  // 1. 先獲取原始服務
  const originalAuthService = this.client.getService<IAuthenticationService>('AuthenticationService');

  // 2. 使用包裝器轉換
  this.authService = GrpcClientWrapper.wrapService(originalAuthService);
}
```

### 效能優化建議

#### 1. 連接池管理

```typescript
// 使用單例模式管理客戶端
@Injectable()
export class GrpcClientManager {
  private static clients: Map<string, any> = new Map();

  static getClient(serviceName: string, endpoint: string) {
    if (!this.clients.has(serviceName)) {
      this.clients.set(serviceName, createServiceClient(endpoint));
    }
    return this.clients.get(serviceName);
  }
}
```

#### 2. 錯誤處理最佳實務

```typescript
async login(email: string, password: string): Promise<LoginResponse> {
  try {
    return await this.authService.login({ email, password });
  } catch (error) {
    // 處理 gRPC 錯誤
    if (error.code === grpc.status.UNAUTHENTICATED) {
      throw new UnauthorizedException('認證失敗');
    }
    throw new InternalServerErrorException('服務暫時無法使用');
  }
}
```

## 📚 相關文件

- [gRPC Node.js 文件](https://grpc.io/docs/languages/node/)
- [NestJS 微服務文件](https://docs.nestjs.com/microservices/basics)
- [GitHub Packages 文件](https://docs.github.com/en/packages)

## 📝 TypeScript 介面支援

這個套件提供了完整的 TypeScript 介面定義，讓你在開發時獲得完整的型別提示和智慧感知。

### 服務介面

```typescript
import {
  IEnterpriseUserService,
  IWalletService,
  IAuthenticationService,
  IAuthorizationService,
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
  UserStatus,
  WalletType,
  TransactionType,
} from '@AlloyXGroup/jupiter-grpc-protos';

// 企業用戶服務介面
const userService: IEnterpriseUserService = client.getService('EnterpriseUserService');

// 錢包服務介面
const walletService: IWalletService = client.getService('WalletService');

// 認證服務介面
const authService: IAuthenticationService = client.getService('AuthenticationService');

// 授權服務介面
const authzService: IAuthorizationService = client.getService('AuthorizationService');
```

### 型別安全的請求/回應

```typescript
// 建立用戶 - 完整的型別提示
const createUserRequest: CreateUserRequest = {
  enterpriseId: 'ent_123',
  firstName: '張',
  lastName: '三',
  email: 'zhangsan@example.com',
  password: 'password123',
  roleId: 1,
};

const response: CreateUserResponse = await userService.createUser(createUserRequest).toPromise();

// 用戶登入
const loginRequest: LoginRequest = {
  enterpriseId: 'ent_123', // 可選參數
  email: 'zhangsan@example.com',
  password: 'password123',
};

const loginResponse: LoginResponse = await authService.login(loginRequest).toPromise();

// 建立錢包
const createWalletRequest: CreateWalletRequest = {
  enterpriseId: 'ent_123',
  customerRefId: 'cust_456',
  walletName: '主錢包',
  userId: 'user_789',
  walletType: WalletType.WALLET_TYPE_PERSONAL,
  supportedCurrencies: ['USD', 'TWD'],
};
```

### 列舉型別

```typescript
// 用戶狀態
UserStatus.USER_STATUS_ACTIVE;
UserStatus.USER_STATUS_INACTIVE;
UserStatus.USER_STATUS_PENDING;
UserStatus.USER_STATUS_SUSPENDED;

// 錢包類型
WalletType.WALLET_TYPE_PERSONAL;
WalletType.WALLET_TYPE_ENTERPRISE;
WalletType.WALLET_TYPE_INVESTMENT;
WalletType.WALLET_TYPE_SAVINGS;

// 交易類型
TransactionType.TRANSACTION_TYPE_DEPOSIT;
TransactionType.TRANSACTION_TYPE_WITHDRAWAL;
TransactionType.TRANSACTION_TYPE_TRANSFER;
TransactionType.TRANSACTION_TYPE_PAYMENT;

// 認證用戶狀態
AuthUserStatus.AUTH_USER_STATUS_ACTIVE;
AuthUserStatus.AUTH_USER_STATUS_INACTIVE;

// KYB 狀態
KybStatus.KYB_STATUS_PENDING;
KybStatus.KYB_STATUS_APPROVED;
KybStatus.KYB_STATUS_REJECTED;

// KYC 狀態
KycStatus.KYC_STATUS_PENDING;
KycStatus.KYC_STATUS_APPROVED;
KycStatus.KYC_STATUS_REJECTED;
```

## 🆕 新增服務

本套件現已支持以下服務：

### 1. 企業用戶服務 (Enterprise User Service)

- 用戶管理
- 企業管理
- 角色權限管理

### 2. 錢包服務 (Wallet Service)

- 錢包管理
- 交易處理
- 餘額查詢

### 3. 認證服務 (Authentication Service) 🆕

- 用戶登入/登出
- 令牌驗證
- 密碼管理

### 4. 授權服務 (Authorization Service) 🆕

- 權限管理
- 存取控制
- 交易記錄查詢

### 服務端點設定

```typescript
export const SERVICE_ENDPOINTS = {
  ENTERPRISE_USER: 'enterprise-user-service:50051',
  WALLET: 'wallet-service:50051',
  AUTHENTICATION: 'authentication-service:50051',
  AUTHORIZATION: 'authorization-service:50051',
} as const;
```

## 💡 重要更新與版本說明

### 🔄 Swagger 同步機制

所有 Proto 定義已與對應的 Swagger (OpenAPI) 規範完全同步，確保：

- ✅ **必需參數與可選參數完全一致**
- ✅ **字段名稱和型別精確匹配**
- ✅ **請求/回應結構統一標準**
- ✅ **自動化同步檢查流程**

### 🏗️ 架構改進

#### 命名約定優化

為避免服務間命名衝突，採用了特定前綴策略：

| 服務     | 前綴範例                            | 說明                   |
| -------- | ----------------------------------- | ---------------------- |
| 認證服務 | `AuthUser`, `AuthUserStatus`        | 避免與企業用戶服務衝突 |
| 授權服務 | `AuthPermission`, `AuthTransaction` | 區分授權相關實體       |
| 企業用戶 | `User`, `UserStatus`                | 保持原有命名           |
| 錢包服務 | `Wallet`, `Transaction`             | 保持原有命名           |

#### 參數調整記錄

**認證服務重要變更**：

- `LoginRequest.enterpriseId` 改為可選參數
- `AuthUser.enterpriseId` 改為可選參數
- `UpdatePasswordRequest` 簡化結構，移除冗餘字段

**詳細變更記錄**：

- 📋 [完整檢查報告](./SWAGGER_PROTO_CHECK_REPORT.md)
- 📚 [新服務使用指南](./NEW_SERVICES.md)

### 🔮 未來規劃

- 🚀 **自動化 Swagger 同步**：計劃建立 CI/CD 流程自動檢查 Swagger 變更
- 📈 **效能監控**：增加 gRPC 調用監控和效能分析
- 🔧 **開發工具**：提供更多開發輔助工具和 CLI 指令
- 🌐 **多語言支援**：計劃支援 Python、Go 等其他語言的客戶端

### 📊 版本兼容性

| 版本 | Node.js | TypeScript | gRPC  | 狀態      |
| ---- | ------- | ---------- | ----- | --------- |
| v1.x | 16+     | 5.0+       | 1.24+ | ✅ 支援中 |
| v2.x | 18+     | 5.2+       | 1.30+ | 🔜 規劃中 |

---

## 📋 目錄索引

- [🏗️ 支援的服務](#️-支援的服務)
- [🚀 快速開始](#-快速開始)
- [🔧 NestJS 微服務整合](#-nestjs-微服務整合)
- [📚 API 使用指南](#-api-使用指南)
- [🎯 Promise 包裝器](#-promise-包裝器)
- [🔢 型別定義與列舉](#-型別定義與列舉)
- [🛠 開發流程](#-開發流程)
- [📋 可用腳本](#-可用腳本)
- [🆘 故障排除](#-故障排除)
- [💡 重要更新與版本說明](#-重要更新與版本說明)
