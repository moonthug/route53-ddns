import pino from 'pino';

import { setAsyncInterval } from './setAsyncInterval';
import { getCurrentPublicIP } from './getCurrentPublicIP';
import { updateRoute53DNSRecord } from './updateRoute53DNSRecord';
import { applyStringTemplate } from './applyStringTemplate';
import { sendSNS } from './sendSNS';

/**
 *
 */
type RecordType = 'A';

/**
 *
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 *
 */
interface ILogger {
  debug: (args: any) => any;
  info: (args: any) => any;
  warn: (args: any) => any;
  error: (args: any) => any;
}

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
  updateSNSSubjectTemplate?: string;
  updateSNSBodyTemplate?: string;
  logger?: ILogger;
  logLevel?: LogLevel;
}

/**
 *
 * @param options
 */
export const runRoute53Updater = async (options: IRunRoute53UpdaterOptions) => {
  const defaults = {
    ttl: 60,
    updateSNSSubjectTemplate: '[{domainName}] Public IP Updated',
    updateSNSBodyTemplate: 'domainName: {domainName}\ncurrentPublicIP: {currentPublicIP}\nhostedZoneID: {hostedZoneID}',
    logLevel: 'info'
  };

  const localOptions = {
    ...defaults,
    ...options
  };

  const logger = localOptions.logger || pino({ level: 'info' });
  let currentPublicIP = '';

  logger.info(`starting`);
  logger.debug(`%O`, localOptions);

  const tick = async () => {
    try {
      const updatedPublicIP = await getCurrentPublicIP();

      if (updatedPublicIP !== currentPublicIP) {
        currentPublicIP = updatedPublicIP;
        logger.info(`new ip: ${currentPublicIP}`);

        await updateRoute53DNSRecord({
          ip: currentPublicIP,
          domainName: localOptions.domainName,
          recordType: localOptions.recordType,
          hostedZoneID: localOptions.hostedZoneID,
          ttl: localOptions.ttl || 60
        });
        logger.info(`domain updated: ${localOptions.domainName}`);

        if (localOptions.updateSNSTopicARN) {
          await sendSNS({
            subject: applyStringTemplate(localOptions.updateSNSSubjectTemplate, { currentPublicIP, ...localOptions }),
            message: applyStringTemplate(localOptions.updateSNSBodyTemplate, { currentPublicIP, ...localOptions }),
            topicARN: localOptions.updateSNSTopicARN
          });
          logger.info(`update notification sent: ${localOptions.updateSNSTopicARN}`);
        }
      } else {
        logger.info(`current ip: ${currentPublicIP}`);
      }
    } catch (e) {
      logger.error(e);
    }
  };

  // Initial call
  await tick();

  // Loop
  setAsyncInterval(tick, localOptions.interval);
};
