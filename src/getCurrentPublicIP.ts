import publicIp from 'public-ip';

/**
 *
 */
export const getCurrentPublicIP = async (): Promise<string> => {
  return publicIp.v4();
};
