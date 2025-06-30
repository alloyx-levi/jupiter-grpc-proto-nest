import { credentials, ChannelCredentials } from '@grpc/grpc-js';
import {
  WalletServiceClient
} from '../../generated/wallet/v1/wallet_grpc_pb';
import { GrpcClientConfig } from './enterprise-user-client';

// 钱包综合服务客户端
export function createWalletServiceClient(config: GrpcClientConfig): WalletServiceClient {
  const clientCredentials = config.credentials || credentials.createInsecure();
  return new WalletServiceClient(config.url, clientCredentials, config.options);
}
