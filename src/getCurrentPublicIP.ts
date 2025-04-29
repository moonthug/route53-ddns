import { publicIpv4 } from 'public-ip';

/**
 *
 */
export const getCurrentPublicIP = async (): Promise<string> => {
  return publicIpv4();
};
