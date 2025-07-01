import { credentials, ChannelCredentials } from '@grpc/grpc-js';
import {
  WalletServiceClient
} from '../../generated/wallet/v1/wallet_grpc_pb';
import { GrpcClientConfig } from './enterprise-user-client';

// Wallet comprehensive service client
export function createWalletServiceClient(config: GrpcClientConfig): WalletServiceClient {
  const clientCredentials = config.credentials || credentials.createInsecure();
  return new WalletServiceClient(config.url, clientCredentials, config.options);
}
