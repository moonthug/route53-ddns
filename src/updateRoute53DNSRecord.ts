import { Route53 } from 'aws-sdk';

/**
 *
 */
interface IUpdateRoute53DNSRecordOptions {
  ip: string;
  domainName: string;
  recordType: string;
  hostedZoneID: string;
  ttl?: number;
}

/**
 *
 * @param options
 */
export const updateRoute53DNSRecord = async (options: IUpdateRoute53DNSRecordOptions) => {
  const route53 = new Route53({ apiVersion: '2013-04-01' });

  const params = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: options.domainName,
            ResourceRecords: [
              {
                Value: options.ip
              }
            ],
            TTL: options.ttl || 60,
            Type: options.recordType
          }
        }
      ]
    },
    HostedZoneId: options.hostedZoneID
  };

  try {
    return await route53.changeResourceRecordSets(params).promise();
  } catch (e) {
    console.error(e);
    throw e;
  }
};
