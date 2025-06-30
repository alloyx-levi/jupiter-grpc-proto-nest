import { Observable } from 'rxjs';

/**
 * gRPC 客户端包装器，自动将 Observable 转换为 Promise
 */
export class GrpcClientWrapper {
  /**
   * 包装 gRPC 服务，自动转换所有方法的返回值从 Observable 到 Promise
   */
  static wrapService<T extends Record<string, any>>(
    client: any,
    serviceName: string
  ): PromisifiedService<T> {
    const service = client.getService(serviceName) as T;
    const wrappedService = {} as any;

    // 获取服务的所有方法
    const proto = Object.getPrototypeOf(service);
    const methodNames = Object.getOwnPropertyNames(proto).filter(
      name => typeof service[name] === 'function' && name !== 'constructor'
    );

    // 包装每个方法
    methodNames.forEach(methodName => {
      wrappedService[methodName] = (...args: any[]) => {
        const result = service[methodName](...args);
        // 如果返回值是 Observable，转换为 Promise
        if (result && typeof result.toPromise === 'function') {
          return result.toPromise();
        }
        return result;
      };
    });

    return wrappedService as PromisifiedService<T>;
  }
}

/**
 * 将服务接口中的所有 Observable<T> 转换为 Promise<T>
 */
export type PromisifiedService<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => Observable<infer R>
  ? (...args: A) => Promise<R>
  : T[K] extends (...args: infer A) => Observable<void>
  ? (...args: A) => Promise<void>
  : T[K];
};

/**
 * Promisified 企业用户服务接口
 */
export type IEnterpriseUserServicePromise = PromisifiedService<import('../interfaces/enterprise-user.interface').IEnterpriseUserService>;

/**
 * Promisified 钱包服务接口
 */
export type IWalletServicePromise = PromisifiedService<import('../interfaces/wallet.interface').IWalletService>;
