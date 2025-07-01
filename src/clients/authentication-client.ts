import { credentials, ChannelCredentials } from '@grpc/grpc-js';
import {
  AuthenticationServiceClient
} from '../../generated/authentication/v1/authentication_grpc_pb';

export interface GrpcClientConfig {
  url: string;
  credentials?: ChannelCredentials;
  options?: any;
}

// Authentication service client
export function createAuthenticationServiceClient(config: GrpcClientConfig): AuthenticationServiceClient {
  const clientCredentials = config.credentials || credentials.createInsecure();
  return new AuthenticationServiceClient(config.url, clientCredentials, config.options);
}
