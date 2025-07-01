// Service endpoint constants (services are now merged, simplified endpoint configuration)
export const SERVICE_ENDPOINTS = {
  ENTERPRISE_USER: 'enterprise-user-service:50051',
  WALLET: 'wallet-service:50051',
  AUTHENTICATION: 'authentication-service:50051',
  AUTHORIZATION: 'authorization-service:50051',
} as const;
