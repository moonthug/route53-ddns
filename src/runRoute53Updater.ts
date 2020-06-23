import { setAsyncInterval } from './setAsyncInterval';
import { getCurrentPublicIP } from './getCurrentPublicIP';
import { updateRoute53DNSRecord } from './updateRoute53DNSRecord';
import { sendSNS } from './sendSNS';

/**
 *
 */
type RecordType = 'A';

/**
 *
 */
interface IRunRoute53UpdaterOptions {
  interval: number;
  domainName: string;
  recordType: RecordType;
  hostedZoneID: string;
  ttl?: number;
  updateSNSTopicARN?: string;
}

/**
 *
 * @param options
 */
export const runRoute53Updater = async (options: IRunRoute53UpdaterOptions) => {
  let currentPublicIP = '';

  setAsyncInterval(async () => {
    try {
      const updatedPublicIP = await getCurrentPublicIP();

      if (updatedPublicIP !== currentPublicIP) {
        currentPublicIP = updatedPublicIP;
        console.log(`new ip: ${currentPublicIP}`);

        await updateRoute53DNSRecord({
          ip: currentPublicIP,
          domainName: options.domainName,
          recordType: options.recordType,
          hostedZoneID: options.hostedZoneID,
          ttl: options.ttl || 60
        });
        console.log(`domain updated: ${options.domainName}`);

        if (options.updateSNSTopicARN) {
          await sendSNS({
            subject: 'Public IP Updated',
            message: `New IP: ${currentPublicIP}`,
            topicARN: options.updateSNSTopicARN
          });
          console.log(`update notification sent: ${options.updateSNSTopicARN}`);
        }
      } else {
        console.log(`current ip: ${currentPublicIP}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, options.interval);
};
