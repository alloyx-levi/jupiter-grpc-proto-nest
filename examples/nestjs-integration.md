# 使用 Jupiter gRPC Proto 包的完整範例

這個文件展示了如何在實際的 NestJS 微服務項目中使用 `@alloyx/jupiter-grpc-protos` 包。

## 安裝和配置

### 1. 安裝包

```bash
npm install @alloyx/jupiter-grpc-protos
```

### 2. 配置 .npmrc

```
@alloyx:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 3. 重要：Proto 文件路徑

安裝包後，proto 文件位於 `node_modules/@alloyx/jupiter-grpc-protos/dist/protos/` 目錄下，而不是根目錄的 `protos/` 目錄。在配置 gRPC 客戶端時，請確保使用正確的路徑：

```typescript
// ✅ 正確的路徑
protoPath: join(
  __dirname,
  '../../../node_modules/@alloyx/jupiter-grpc-protos/dist/protos/enterprise-user/v1/enterprise_user.proto'
);

// ❌ 錯誤的路徑
protoPath: join(
  __dirname,
  '../../../node_modules/@alloyx/jupiter-grpc-protos/protos/enterprise-user/v1/enterprise_user.proto'
);
```

## 企業用戶服務集成

### 模組配置

```typescript
// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ENTERPRISE_USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'enterprise_user.v1',
          protoPath: join(
            __dirname,
            '../../../node_modules/@alloyx/jupiter-grpc-protos/dist/protos/enterprise-user/v1/enterprise_user.proto'
          ),
          url: process.env.ENTERPRISE_USER_GRPC_URL || 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

### 服務實現（使用 Promise 包裝器）

```typescript
// src/modules/user/user.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IEnterpriseUserService,
  IEnterpriseUserServicePromise,
  GrpcClientWrapper,
  CreateUserRequest,
  CreateUserResponse,
  FindUsersRequest,
  FindUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
  UserStatus,
} from '@alloyx/jupiter-grpc-protos';

@Injectable()
export class UserService implements OnModuleInit {
  private enterpriseUserService: IEnterpriseUserServicePromise;

  constructor(@Inject('ENTERPRISE_USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // Use wrapper to automatically convert to Promise
    this.enterpriseUserService = GrpcClientWrapper.wrapService<IEnterpriseUserService>(
      this.client,
      'EnterpriseUserService'
    );
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const request: CreateUserRequest = {
      enterpriseId: createUserDto.enterpriseId,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
      roleId: createUserDto.roleId,
    };

    // No need for .toPromise(), directly await
    return this.enterpriseUserService.createUser(request);
  }

  async findUsers(query: FindUsersQuery): Promise<FindUsersResponse> {
    const request: FindUsersRequest = {
      enterpriseId: query.enterpriseId,
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
    };

    // No need for .toPromise(), directly await
    return this.enterpriseUserService.findUsers(request);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    const request: UpdateUserRequest = {
      userId: userId,
      enterpriseId: updateUserDto.enterpriseId,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      roleId: updateUserDto.roleId,
    };

    // No need for .toPromise(), directly await
    return this.enterpriseUserService.updateUser(request);
  }

  async updateUserStatus(
    userId: string,
    enterpriseId: string,
    status: UserStatus
  ): Promise<UpdateUserStatusResponse> {
    const request: UpdateUserStatusRequest = {
      userId: userId,
      enterpriseId: enterpriseId,
      status,
    };

    // No need for .toPromise(), directly await
    return this.enterpriseUserService.updateUserStatus(request);
  }
}
```

### 服務實現的兩種方式

#### 方式一：直接使用 gRPC 客戶端（需要 .toPromise()）

```typescript
// src/modules/user/user.service.ts (Original method)
import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IEnterpriseUserService,
  CreateUserRequest,
  CreateUserResponse,
  FindUsersRequest,
  FindUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
  UserStatus,
} from '@alloyx/jupiter-grpc-protos';

@Injectable()
export class UserService {
  private enterpriseUserService: IEnterpriseUserService;

  constructor(@Inject('ENTERPRISE_USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.enterpriseUserService =
      this.client.getService<IEnterpriseUserService>('EnterpriseUserService');
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const request: CreateUserRequest = {
      enterpriseId: createUserDto.enterpriseId,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
      roleId: createUserDto.roleId,
    };

    // Need to manually call .toPromise()
    return this.enterpriseUserService.createUser(request).toPromise();
  }

  async findUsers(query: FindUsersQuery): Promise<FindUsersResponse> {
    const request: FindUsersRequest = {
      enterpriseId: query.enterpriseId,
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
    };

    // Need to manually call .toPromise()
    return this.enterpriseUserService.findUsers(request).toPromise();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    const request: UpdateUserRequest = {
      userId: id,
      enterpriseId: updateUserDto.enterpriseId,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      roleId: updateUserDto.roleId,
    };

    // Need to manually call .toPromise()
    return this.enterpriseUserService.updateUser(request).toPromise();
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<UpdateUserStatusResponse> {
    const request: UpdateUserStatusRequest = { userId: id, enterpriseId: '', status };

    // 需要手动调用 .toPromise()
    return this.enterpriseUserService.updateUserStatus(request).toPromise();
  }
}
```

#### 方式二：使用 GrpcClientWrapper（推荐）

```typescript
// src/modules/user/user.service.ts (推荐方式)
import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IEnterpriseUserService,
  IEnterpriseUserServicePromise,
  GrpcClientWrapper,
  CreateUserRequest,
  CreateUserResponse,
  FindUsersRequest,
  FindUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
  UserStatus,
} from '@alloyx/jupiter-grpc-protos';

@Injectable()
export class UserService {
  private enterpriseUserService: IEnterpriseUserServicePromise;

  constructor(@Inject('ENTERPRISE_USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // 使用 GrpcClientWrapper 静态方法包装服务
    this.enterpriseUserService = GrpcClientWrapper.wrapService<IEnterpriseUserService>(
      this.client,
      'EnterpriseUserService'
    );
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const request: CreateUserRequest = {
      enterprise_id: createUserDto.enterpriseId,
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
      role_id: createUserDto.roleId,
    };

    // 直接返回 Promise，无需 .toPromise()
    return this.enterpriseUserService.createUser(request);
  }

  async findUsers(query: FindUsersQuery): Promise<FindUsersResponse> {
    const request: FindUsersRequest = {
      enterprise_id: query.enterpriseId,
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
    };

    // 直接返回 Promise，无需 .toPromise()
    return this.enterpriseUserService.findUsers(request);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    const request: UpdateUserRequest = {
      id,
      first_name: updateUserDto.firstName,
      last_name: updateUserDto.lastName,
      email: updateUserDto.email,
      role_id: updateUserDto.roleId,
    };

    // 直接返回 Promise，无需 .toPromise()
    return this.enterpriseUserService.updateUser(request);
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<UpdateUserStatusResponse> {
    const request: UpdateUserStatusRequest = { id, status };

    // 直接返回 Promise，无需 .toPromise()
    return this.enterpriseUserService.updateUserStatus(request);
  }
}
```

## 钱包服务集成

### 模块配置

```typescript
// src/modules/wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WALLET_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'wallet.v1',
          protoPath: join(
            __dirname,
            '../../../node_modules/@alloyx/jupiter-grpc-protos/dist/protos/wallet/v1/wallet.proto'
          ),
          url: process.env.WALLET_GRPC_URL || 'localhost:50052',
        },
      },
    ]),
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
```

### 钱包服务实现

```typescript
// src/modules/wallet/wallet.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IWalletService,
  IWalletServicePromise,
  GrpcClientWrapper,
  CreateWalletRequest,
  CreateWalletResponse,
  GetWalletsRequest,
  GetWalletsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  WalletType,
  TransactionType,
  TransactionStatus,
} from '@alloyx/jupiter-grpc-protos';

@Injectable()
export class WalletService implements OnModuleInit {
  private walletService: IWalletServicePromise;

  constructor(@Inject('WALLET_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // 使用包装器自动转换为 Promise
    this.walletService = GrpcClientWrapper.wrapService<IWalletService>(
      this.client,
      'WalletService'
    );
  }

  async createWallet(createWalletDto: CreateWalletDto): Promise<CreateWalletResponse> {
    const request: CreateWalletRequest = {
      enterpriseId: createWalletDto.enterpriseId,
      customerRefId: createWalletDto.customerRefId,
      walletName: createWalletDto.walletName,
      userId: createWalletDto.userId,
      walletType: createWalletDto.walletType as WalletType,
      initialCurrency: createWalletDto.initialCurrency,
    };

    // 直接返回 Promise，无需 .toPromise()
    return this.walletService.createWallet(request);
  }

  async getWallets(query: GetWalletsQuery): Promise<GetWalletsResponse> {
    const request: GetWalletsRequest = {
      enterpriseId: query.enterpriseId,
      page: query.page || 1,
      limit: query.limit || 10,
      userId: query.userId,
      walletType: query.walletType,
      status: query.status,
    };

    return this.walletService.getWallets(request);
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto
  ): Promise<CreateTransactionResponse> {
    const request: CreateTransactionRequest = {
      fromWalletId: createTransactionDto.fromWalletId,
      toWalletId: createTransactionDto.toWalletId,
      transactionType: createTransactionDto.transactionType as TransactionType,
      amount: createTransactionDto.amount,
      currency: createTransactionDto.currency,
      description: createTransactionDto.description,
      metadata: createTransactionDto.metadata,
    };

    return this.walletService.createTransaction(request);
  }
}
```

## 控制器示例

### 用户控制器

```typescript
// src/modules/user/user.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { GrpcTimeoutInterceptor } from '../../common/interceptors/grpc-timeout.interceptor';

@Controller('enterprises/:enterpriseId/users')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcTimeoutInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Param('enterpriseId') enterpriseId: string,
    @Body() createUserDto: CreateUserDto,
    @Headers('x-user-id') userId: string
  ) {
    return this.userService.createUser({
      ...createUserDto,
      enterpriseId,
    });
  }

  @Get()
  async findUsers(
    @Param('enterpriseId') enterpriseId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string
  ) {
    return this.userService.findUsers({
      enterpriseId,
      page,
      limit,
      status,
    });
  }

  @Patch(':userId')
  async updateUser(
    @Param('enterpriseId') enterpriseId: string,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUser(userId, {
      ...updateUserDto,
      enterpriseId,
    });
  }

  @Patch(':userId/status')
  async updateUserStatus(
    @Param('enterpriseId') enterpriseId: string,
    @Param('userId') userId: string,
    @Body() updateStatusDto: UpdateStatusDto
  ) {
    return this.userService.updateUserStatus(userId, enterpriseId, updateStatusDto.status);
  }
}
```

## 错误处理和拦截器

### gRPC 异常过滤器

```typescript
// src/common/filters/grpc-exception.filter.ts
import { Catch, RpcExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    const response = host.switchToHttp().getResponse();

    const errorResponse = {
      success: false,
      errorCode: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Internal server error',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9),
      },
    };

    const httpStatus = this.getHttpStatus(error.code);
    response.status(httpStatus).json(errorResponse);

    return throwError(errorResponse);
  }

  private getHttpStatus(errorCode: string): number {
    switch (errorCode) {
      case 'USER_NOT_FOUND':
      case 'ENTERPRISE_NOT_FOUND':
      case 'WALLET_NOT_FOUND':
        return HttpStatus.NOT_FOUND;
      case 'VALIDATION_ERROR':
        return HttpStatus.BAD_REQUEST;
      case 'INVALID_PERMISSION':
        return HttpStatus.FORBIDDEN;
      case 'INSUFFICIENT_BALANCE':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
```

### 超时拦截器

```typescript
// src/common/interceptors/grpc-timeout.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class GrpcTimeoutInterceptor implements NestInterceptor {
  private readonly timeoutMs = 30000; // 30 秒

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException('Service request timeout'));
        }
        return throwError(err);
      })
    );
  }
}
```

## 环境配置

### 配置文件

```typescript
// src/config/grpc.config.ts
export interface GrpcServiceConfig {
  url: string;
  timeout?: number;
  retries?: number;
}

export interface GrpcConfig {
  enterpriseUser: GrpcServiceConfig;
  wallet: GrpcServiceConfig;
  transaction: GrpcServiceConfig;
}

export const grpcConfig = (): GrpcConfig => ({
  enterpriseUser: {
    url: process.env.ENTERPRISE_USER_GRPC_URL || 'localhost:50051',
    timeout: parseInt(process.env.GRPC_TIMEOUT) || 30000,
    retries: parseInt(process.env.GRPC_RETRIES) || 3,
  },
  wallet: {
    url: process.env.WALLET_GRPC_URL || 'localhost:50052',
    timeout: parseInt(process.env.GRPC_TIMEOUT) || 30000,
    retries: parseInt(process.env.GRPC_RETRIES) || 3,
  },
  transaction: {
    url: process.env.TRANSACTION_GRPC_URL || 'localhost:50053',
    timeout: parseInt(process.env.GRPC_TIMEOUT) || 30000,
    retries: parseInt(process.env.GRPC_RETRIES) || 3,
  },
});
```

## Docker 配置

### docker-compose.yml

```yaml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - ENTERPRISE_USER_GRPC_URL=enterprise-user-service:50051
      - WALLET_GRPC_URL=wallet-service:50052
      - TRANSACTION_GRPC_URL=transaction-service:50053
      - GRPC_TIMEOUT=30000
      - GRPC_RETRIES=3
    depends_on:
      - enterprise-user-service
      - wallet-service
      - transaction-service
    networks:
      - jupiter-network

  # 企业用户服务
  enterprise-user-service:
    build: ./enterprise-user-service
    ports:
      - '50051:50051'
    environment:
      - GRPC_PORT=50051
      - DATABASE_URL=postgresql://user:password@postgres:5432/enterprise_user
    depends_on:
      - postgres
    networks:
      - jupiter-network

  # 钱包服务
  wallet-service:
    build: ./wallet-service
    ports:
      - '50052:50052'
    environment:
      - GRPC_PORT=50052
      - DATABASE_URL=postgresql://user:password@postgres:5432/wallet
    depends_on:
      - postgres
      - redis
    networks:
      - jupiter-network

  # 交易服务
  transaction-service:
    build: ./transaction-service
    ports:
      - '50053:50053'
    environment:
      - GRPC_PORT=50053
      - DATABASE_URL=postgresql://user:password@postgres:5432/transaction
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - jupiter-network

  # 数据库
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=jupiter
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - jupiter-network

  # Redis 缓存
  redis:
    image: redis:7
    networks:
      - jupiter-network

volumes:
  postgres_data:

networks:
  jupiter-network:
    driver: bridge
```

## DTO 类型定义

### 用户相关 DTO

```typescript
// src/modules/user/dto/create-user.dto.ts
import { IsEmail, IsString, IsNumber, IsOptional } from 'class-validator';
import { UserStatus } from '@alloyx/jupiter-grpc-protos';

export class CreateUserDto {
  @IsString()
  enterpriseId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  roleId: number;
}

export class UpdateUserDto {
  @IsString()
  enterpriseId: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;
}

export class FindUsersQuery {
  @IsString()
  enterpriseId: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  status?: UserStatus;
}

export class UpdateStatusDto {
  status: UserStatus;
}
```

### 钱包相关 DTO

```typescript
// src/modules/wallet/dto/create-wallet.dto.ts
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { WalletType, TransactionType, WalletStatus } from '@alloyx/jupiter-grpc-protos';

export class CreateWalletDto {
  @IsString()
  enterpriseId: string;

  @IsString()
  customerRefId: string;

  @IsString()
  walletName: string;

  @IsString()
  userId: string;

  @IsEnum(WalletType)
  walletType: WalletType;

  @IsOptional()
  @IsString()
  initialCurrency?: string;
}

export class CreateTransactionDto {
  @IsString()
  fromWalletId: string;

  @IsString()
  toWalletId: string;

  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsString()
  amount: string;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  metadata?: Record<string, string>;
}

export class GetWalletsQuery {
  @IsString()
  enterpriseId: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(WalletType)
  walletType?: WalletType;

  @IsOptional()
  @IsEnum(WalletStatus)
  status?: WalletStatus;
}
```

## 🚀 Promise 包装器使用指南

为了避免每次都手动调用 `.toPromise()`，这个包提供了 `GrpcClientWrapper` 解决方案：

### 使用 GrpcClientWrapper（推荐）

```typescript
import {
  GrpcClientWrapper,
  IEnterpriseUserService,
  IEnterpriseUserServicePromise,
} from '@alloyx/jupiter-grpc-protos';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: IEnterpriseUserServicePromise; // 注意使用 Promise 版本的接口

  constructor(@Inject('ENTERPRISE_USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // 使用 GrpcClientWrapper 静态方法包装服务
    this.userService = GrpcClientWrapper.wrapService<IEnterpriseUserService>(
      this.client,
      'EnterpriseUserService'
    );
  }

  async createUser(dto: CreateUserDto) {
    const request: CreateUserRequest = {
      // ... 构建请求对象
    };

    // 直接 await，无需 .toPromise()
    return this.userService.createUser(request);
  }
}
```

### 优势对比

| 特性       | 原始方法               | GrpcClientWrapper   |
| ---------- | ---------------------- | ------------------- |
| 代码简洁性 | ❌ 需要 `.toPromise()` | ✅ 无需手动转换     |
| 类型安全   | ✅ 完整类型提示        | ✅ Promise 类型提示 |
| 继承关系   | ✅ 无继承约束          | ✅ 无继承约束       |
| 统一处理   | ❌ 每个方法重复        | ✅ 一次包装全部转换 |
| 学习成本   | ✅ 原生 gRPC 方式      | ✅ 简单包装器       |

**推荐使用 GrpcClientWrapper 方案**，它提供了最佳的灵活性和易用性平衡。

这个示例展示了完整的 gRPC 微服务架构，包括错误处理、超时控制、配置管理和 Docker 部署。你可以根据实际需求调整配置和实现细节。

## 🔄 重要：字段命名约定转换

### Proto vs TypeScript 字段命名

在使用 Jupiter gRPC Proto 包时，需要注意以下重要的命名约定转换：

#### 1. Proto 文件（snake_case）

```protobuf
message CreateUserRequest {
  string enterprise_id = 1;
  string first_name = 2;
  string last_name = 3;
  string email = 4;
  string password = 5;
  int32 role_id = 6;
}
```

#### 2. TypeScript 接口（camelCase）

```typescript
export interface CreateUserRequest {
  enterpriseId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}
```

#### 3. 使用示例

```typescript
// ✅ 正确的字段命名（camelCase）
const request: CreateUserRequest = {
  enterpriseId: 'ent_123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  roleId: 1,
};

// ❌ 错误的字段命名（snake_case）
const request: CreateUserRequest = {
  enterprise_id: 'ent_123', // 错误！
  first_name: 'John', // 错误！
  last_name: 'Doe', // 错误！
  email: 'john@example.com',
  password: 'password123',
  role_id: 1, // 错误！
};
```

### 命名转换规则

| Proto (snake_case) | TypeScript (camelCase) |
| ------------------ | ---------------------- |
| `enterprise_id`    | `enterpriseId`         |
| `first_name`       | `firstName`            |
| `last_name`        | `lastName`             |
| `role_id`          | `roleId`               |
| `user_id`          | `userId`               |
| `wallet_id`        | `walletId`             |
| `transaction_id`   | `transactionId`        |
| `customer_ref_id`  | `customerRefId`        |
| `wallet_name`      | `walletName`           |
| `wallet_type`      | `walletType`           |
| `created_at`       | `createdAt`            |
| `updated_at`       | `updatedAt`            |

### 为什么需要这种转换？

1. **protobuf 规范**：官方推荐使用 `snake_case` 命名
2. **JavaScript/TypeScript 规范**：推荐使用 `camelCase` 命名
3. **gRPC 代码生成器**：自动处理这种转换，生成符合 JavaScript 规范的接口

### 检查生成的类型定义

如果不确定字段名称，可以查看生成的类型定义文件：

```bash
# 查看生成的类型定义
cat node_modules/@alloyx/jupiter-grpc-protos/dist/generated/enterprise-user/v1/enterprise_user_pb.d.ts
```

生成的 `AsObject` 类型会显示正确的 camelCase 字段名：

```typescript
export namespace CreateUserRequest {
  export type AsObject = {
    enterpriseId: string; // ✅ camelCase
    firstName: string; // ✅ camelCase
    lastName: string; // ✅ camelCase
    email: string;
    password: string;
    roleId: number; // ✅ camelCase
  };
}
```

记住：在 TypeScript 代码中始终使用 **camelCase** 字段名，即使 proto 文件使用 snake_case！
