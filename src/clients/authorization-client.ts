import { credentials, ChannelCredentials } from '@grpc/grpc-js';
import {
  AuthorizationServiceClient
} from '../../generated/authorization/v1/authorization_grpc_pb';

export interface GrpcClientConfig {
  url: string;
  credentials?: ChannelCredentials;
  options?: any;
}

// Authorization service client
export function createAuthorizationServiceClient(config: GrpcClientConfig): AuthorizationServiceClient {
  const clientCredentials = config.credentials || credentials.createInsecure();
  return new AuthorizationServiceClient(config.url, clientCredentials, config.options);
}
