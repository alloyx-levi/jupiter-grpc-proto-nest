import { Observable } from 'rxjs';

/**
 * gRPC client wrapper that automatically converts Observable to Promise
 */
export class GrpcClientWrapper {
  /**
   * Wrap gRPC service, automatically convert all method return values from Observable to Promise
   */
  static wrapService<T extends Record<string, any>>(
    service: T,
  ): PromisifiedService<T> {
    const wrappedService = {} as any;

    // Get all methods of the service
    const proto = Object.getPrototypeOf(service);
    const methodNames = Object.getOwnPropertyNames(proto).filter(
      name => typeof service[name] === 'function' && name !== 'constructor'
    );

    // Wrap each method
    methodNames.forEach(methodName => {
      wrappedService[methodName] = (...args: any[]) => {
        const result = service[methodName](...args);
        // If return value is Observable, convert to Promise
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
 * Convert all Observable<T> to Promise<T> in service interface
 */
export type PromisifiedService<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => Observable<infer R>
  ? (...args: A) => Promise<R>
  : T[K] extends (...args: infer A) => Observable<void>
  ? (...args: A) => Promise<void>
  : T[K];
};

/**
 * Promisified enterprise user service interface
 */
export type IEnterpriseUserServicePromise = PromisifiedService<import('../interfaces/enterprise-user.interface').IEnterpriseUserService>;

/**
 * Promisified wallet service interface
 */
export type IWalletServicePromise = PromisifiedService<import('../interfaces/wallet.interface').IWalletService>;

/**
 * Promisified authentication service interface
 */
export type IAuthenticationServicePromise = PromisifiedService<import('../interfaces/authentication.interface').IAuthenticationService>;

/**
 * Promisified authorization service interface
 */
export type IAuthorizationServicePromise = PromisifiedService<import('../interfaces/authorization.interface').IAuthorizationService>;
