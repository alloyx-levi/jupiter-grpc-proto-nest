import { credentials, ChannelCredentials } from '@grpc/grpc-js';
import {
  EnterpriseUserServiceClient
} from '../../generated/enterprise-user/v1/enterprise_user_grpc_pb';

export interface GrpcClientConfig {
  url: string;
  credentials?: ChannelCredentials;
  options?: any;
}

// 企业用户综合服务客户端
export function createEnterpriseUserServiceClient(config: GrpcClientConfig): EnterpriseUserServiceClient {
  const clientCredentials = config.credentials || credentials.createInsecure();
  return new EnterpriseUserServiceClient(config.url, clientCredentials, config.options);
}
