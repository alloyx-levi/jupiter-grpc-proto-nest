# Jupiter gRPC Proto Repository

统一管理 Jupiter 微服务的 gRPC proto 文件的仓库，通过 GitHub Packages 进行版本管理。

## 📁 项目结构

```
jupiter-grpc-proto-nest/
├── protos/                          # Proto 文件源码
│   ├── enterprise-user/
│   │   └── v1/
│   │       └── enterprise_user.proto
│   └── wallet/
│       └── v1/
│           └── wallet.proto
├── generated/                       # 自动生成的代码
│   ├── protos/
│   │   ├── enterprise-user/
│   │   └── wallet/
├── src/                            # TypeScript 源码
│   ├── clients/                    # gRPC 客户端封装
│   ├── types.ts                    # 类型定义
│   └── constants.ts                # 常量定义
├── dist/                           # 编译后的文件
├── package.json                    # 包配置
├── tsconfig.json                   # TypeScript 配置
└── .github/workflows/              # CI/CD 配置
    └── build-and-publish.yml
```

## 🚀 使用方法

### 1. 安装包

```bash
# 从 GitHub Packages 安装
npm install @alloyx/jupiter-grpc-protos

# 或者使用 yarn
yarn add @alloyx/jupiter-grpc-protos
```

### 2. 在 NestJS 微服务中使用

#### 配置 .npmrc 文件

在项目根目录创建 `.npmrc` 文件：

```
@alloyx:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

#### 在微服务中使用客户端

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  createEnterpriseUserServiceClient,
  createWalletServiceClient,
  SERVICE_ENDPOINTS,
} from '@alloyx/jupiter-grpc-protos';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ENTERPRISE_USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'enterprise_user.v1',
          protoPath: require.resolve(
            '@alloyx/jupiter-grpc-protos/protos/enterprise-user/v1/enterprise_user.proto'
          ),
          url: SERVICE_ENDPOINTS.ENTERPRISE_USER,
        },
      },
      {
        name: 'WALLET_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'wallet.v1',
          protoPath: require.resolve('@alloyx/jupiter-grpc-protos/protos/wallet/v1/wallet.proto'),
          url: SERVICE_ENDPOINTS.WALLET,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

#### 在服务中使用

```typescript
// user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  EnterpriseUserServiceClient,
  CreateUserRequest,
  CreateUserResponse,
} from '@alloyx/jupiter-grpc-protos';

@Injectable()
export class UserService {
  private enterpriseUserService: EnterpriseUserServiceClient;

  constructor(@Inject('ENTERPRISE_USER_SERVICE') private client: ClientGrpc) {
    this.enterpriseUserService =
      this.client.getService<EnterpriseUserServiceClient>('EnterpriseUserService');
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    return this.enterpriseUserService.createUser(request).toPromise();
  }
}
```

## 🎯 Promise 包装器 - 告别 .toPromise()

为了提供更好的开发体验，这个包内置了 Promise 包装器，让你无需每次都手动调用 `.toPromise()`。

### 基本用法

```typescript
import {
  GrpcClientWrapper,
  IEnterpriseUserService,
  IEnterpriseUserServicePromise,
  CreateUserRequest,
} from '@alloyx/jupiter-grpc-protos';

// 使用包装器
const userService: IEnterpriseUserServicePromise =
  GrpcClientWrapper.wrapService<IEnterpriseUserService>(client, 'EnterpriseUserService');

// 直接 await，无需 .toPromise()
const response = await userService.createUser(request);
```

### 类型对比

```typescript
// 原始 Observable 接口
interface IEnterpriseUserService {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;
}

// Promise 包装后的接口
interface IEnterpriseUserServicePromise {
  createUser(request: CreateUserRequest): Promise<CreateUserResponse>;
}
```

### 在 NestJS 中使用

```typescript
@Injectable()
export class UserService implements OnModuleInit {
  private userService: IEnterpriseUserServicePromise;

  constructor(@Inject('ENTERPRISE_USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = GrpcClientWrapper.wrapService<IEnterpriseUserService>(
      this.client,
      'EnterpriseUserService'
    );
  }

  async createUser(dto: CreateUserDto) {
    const request: CreateUserRequest = {
      /* ... */
    };

    // ✅ 简洁的 Promise 语法
    return this.userService.createUser(request);

    // ❌ 不再需要这样写
    // return this.userService.createUser(request).toPromise();
  }
}
```

## 🛠 开发流程

### 1. 添加新的 Proto 文件

1. 在 `protos/` 目录下创建新的服务文件
2. 更新 `package.json` 中的生成脚本
3. 在 `src/clients/` 中添加对应的客户端封装
4. 更新 `index.ts` 导出新的客户端

### 2. 本地开发

```bash
# 安装依赖
npm install

# 生成 proto 文件
npm run generate:proto

# 构建 TypeScript
npm run build:ts

# 完整构建
npm run build
```

### 3. 版本发布

#### 自动发布（推荐）

```bash
# 发布补丁版本
npm run version:patch && git push --tags

# 发布次要版本
npm run version:minor && git push --tags

# 发布主要版本
npm run version:major && git push --tags
```

#### 手动发布

```bash
# 构建
npm run build

# 发布到 GitHub Packages
npm publish
```

## 📝 Proto 文件规范

### 1. 文件命名规范

- 使用小写字母和下划线
- 文件名应描述服务功能
- 例：`enterprise_user.proto`, `wallet.proto`

### 2. 包命名规范

```protobuf
package service_name.v1;
option go_package = "github.com/alloyx/jupiter-grpc-protos/service-name/v1";
```

### 3. 消息命名规范

- 使用 PascalCase
- Request/Response 后缀
- 例：`CreateUserRequest`, `CreateUserResponse`

### 4. 服务命名规范

- 使用 PascalCase
- Service 后缀
- 例：`EnterpriseUserService`, `WalletService`

## 🔧 配置说明

### GitHub Packages 配置

在 `package.json` 中配置：

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "@alloyx:registry": "https://npm.pkg.github.com"
  }
}
```

### CI/CD 配置

GitHub Actions 会自动：

1. 在 PR 和推送时进行代码检查
2. 生成 proto 文件和 TypeScript 代码
3. 在推送到 main 分支或创建 tag 时发布包
4. 创建 GitHub Release

## 📋 可用脚本

```bash
npm run build              # 完整构建流程
npm run generate:proto     # 生成 proto 文件
npm run build:ts          # 构建 TypeScript
npm run clean             # 清理生成的文件
npm run lint              # 代码检查
npm run format            # 代码格式化
npm run test              # 运行测试
npm run release           # 发布包
```

## 📦 包内容

发布的包包含：

- `protos/`: 原始 proto 文件
- `generated/`: 生成的 JavaScript/TypeScript 代码
- `dist/`: 编译后的 TypeScript 代码
- 类型定义文件

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License

## 🆘 故障排除

### 1. 包安装失败

确保已配置 GitHub Packages 认证：

```bash
npm login --scope=@alloyx --registry=https://npm.pkg.github.com
```

### 2. Proto 生成失败

检查是否安装了必要的工具：

```bash
npm install -g grpc-tools
```

### 3. 类型定义问题

确保安装了所有类型依赖：

```bash
npm install @types/node @grpc/grpc-js google-protobuf
```

## 📚 相关文档

- [gRPC Node.js 文档](https://grpc.io/docs/languages/node/)
- [NestJS 微服务文档](https://docs.nestjs.com/microservices/basics)
- [GitHub Packages 文档](https://docs.github.com/en/packages)

## 📝 TypeScript 接口支持

这个包提供了完整的 TypeScript 接口定义，让你在开发时获得完整的类型提示和智能感知。

### 服务接口

```typescript
import {
  IEnterpriseUserService,
  IWalletService,
  CreateUserRequest,
  CreateUserResponse,
  UserStatus,
  WalletType,
  TransactionType,
} from '@alloyx/jupiter-grpc-protos';

// 企业用户服务接口
const userService: IEnterpriseUserService = client.getService('EnterpriseUserService');

// 钱包服务接口
const walletService: IWalletService = client.getService('WalletService');
```

### 类型安全的请求/响应

```typescript
// 创建用户 - 完整的类型提示
const createUserRequest: CreateUserRequest = {
  enterprise_id: 'ent_123',
  first_name: '张',
  last_name: '三',
  email: 'zhangsan@example.com',
  password: 'password123',
  role_id: 1,
};

const response: CreateUserResponse = await userService.createUser(createUserRequest).toPromise();

// 创建钱包
const createWalletRequest: CreateWalletRequest = {
  enterprise_id: 'ent_123',
  customer_ref_id: 'cust_456',
  wallet_name: '主钱包',
  user_id: 'user_789',
  wallet_type: WalletType.WALLET_TYPE_PERSONAL,
  initial_currency: 'USD',
};
```

### 枚举类型

```typescript
// 用户状态
UserStatus.USER_STATUS_ACTIVE;
UserStatus.USER_STATUS_INACTIVE;
UserStatus.USER_STATUS_PENDING;
UserStatus.USER_STATUS_SUSPENDED;

// 钱包类型
WalletType.WALLET_TYPE_PERSONAL;
WalletType.WALLET_TYPE_ENTERPRISE;
WalletType.WALLET_TYPE_INVESTMENT;
WalletType.WALLET_TYPE_SAVINGS;

// 交易类型
TransactionType.TRANSACTION_TYPE_DEPOSIT;
TransactionType.TRANSACTION_TYPE_WITHDRAWAL;
TransactionType.TRANSACTION_TYPE_TRANSFER;
TransactionType.TRANSACTION_TYPE_PAYMENT;
```
