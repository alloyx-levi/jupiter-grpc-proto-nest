# 使用 Jupiter gRPC Proto 包的完整示例

这个文件展示了如何在实际的 NestJS 微服务项目中使用 `@alloyx/jupiter-grpc-protos` 包。

## 安装和配置

### 1. 安装包

```bash
npm install @alloyx/jupiter-grpc-protos
```

### 2. 配置 .npmrc

```
@alloyx:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## 企业用户服务集成

### 模块配置

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
            '../../../node_modules/@alloyx/jupiter-grpc-protos/protos/enterprise-user/v1/enterprise_user.proto'
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

### 服务实现（使用 Promise 包装器）

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
    // 使用包装器自动转换为 Promise
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

    // 不需要 .toPromise()，直接 await
    return this.enterpriseUserService.createUser(request);
  }

  async findUsers(query: FindUsersQuery): Promise<FindUsersResponse> {
    const request: FindUsersRequest = {
      enterprise_id: query.enterpriseId,
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
    };

    // 不需要 .toPromise()，直接 await
    return this.enterpriseUserService.findUsers(request);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    const request: UpdateUserRequest = {
      user_id: userId,
      enterprise_id: updateUserDto.enterpriseId,
      first_name: updateUserDto.firstName,
      last_name: updateUserDto.lastName,
      role_id: updateUserDto.roleId,
    };

    // 不需要 .toPromise()，直接 await
    return this.enterpriseUserService.updateUser(request);
  }

  async updateUserStatus(
    userId: string,
    enterpriseId: string,
    status: UserStatus
  ): Promise<UpdateUserStatusResponse> {
    const request: UpdateUserStatusRequest = {
      user_id: userId,
      enterprise_id: enterpriseId,
      status,
    };

    // 不需要 .toPromise()，直接 await
    return this.enterpriseUserService.updateUserStatus(request);
  }
}
```

### 服务实现的两种方式

#### 方式一：直接使用 gRPC 客户端（需要 .toPromise()）

```typescript
// src/modules/user/user.service.ts (原始方式)
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
      enterprise_id: createUserDto.enterpriseId,
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
      role_id: createUserDto.roleId,
    };

    // 需要手动调用 .toPromise()
    return this.enterpriseUserService.createUser(request).toPromise();
  }

  async findUsers(query: FindUsersQuery): Promise<FindUsersResponse> {
    const request: FindUsersRequest = {
      enterprise_id: query.enterpriseId,
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
    };

    // 需要手动调用 .toPromise()
    return this.enterpriseUserService.findUsers(request).toPromise();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    const request: UpdateUserRequest = {
      id,
      first_name: updateUserDto.firstName,
      last_name: updateUserDto.lastName,
      email: updateUserDto.email,
      role_id: updateUserDto.roleId,
    };

    // 需要手动调用 .toPromise()
    return this.enterpriseUserService.updateUser(request).toPromise();
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<UpdateUserStatusResponse> {
    const request: UpdateUserStatusRequest = { id, status };

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
            '../../../node_modules/@alloyx/jupiter-grpc-protos/protos/wallet/v1/wallet.proto'
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
      enterprise_id: createWalletDto.enterpriseId,
      customer_ref_id: createWalletDto.customerRefId,
      wallet_name: createWalletDto.walletName,
      user_id: createWalletDto.userId,
      wallet_type: createWalletDto.walletType as WalletType,
      initial_currency: createWalletDto.initialCurrency,
    };

    // 直接返回 Promise，无需 .toPromise()
    return this.walletService.createWallet(request);
  }

  async getWallets(query: GetWalletsQuery): Promise<GetWalletsResponse> {
    const request: GetWalletsRequest = {
      enterprise_id: query.enterpriseId,
      page: query.page || 1,
      limit: query.limit || 10,
      user_id: query.userId,
      wallet_type: query.walletType,
      status: query.status,
    };

    return this.walletService.getWallets(request);
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto
  ): Promise<CreateTransactionResponse> {
    const request: CreateTransactionRequest = {
      from_wallet_id: createTransactionDto.fromWalletId,
      to_wallet_id: createTransactionDto.toWalletId,
      transaction_type: createTransactionDto.transactionType as TransactionType,
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
