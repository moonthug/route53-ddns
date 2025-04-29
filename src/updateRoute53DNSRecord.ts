import { Route53Client, ChangeResourceRecordSetsCommand, RRType } from '@aws-sdk/client-route-53';

/**
 *
 */
interface IUpdateRoute53DNSRecordOptions {
  ip: string;
  domainName: string;
  recordType: RRType;
  hostedZoneID: string;
  ttl?: number;
}

/**
 *
 * @param options
 */
export const updateRoute53DNSRecord = async (options: IUpdateRoute53DNSRecordOptions) => {
  const client = new Route53Client({ apiVersion: '2013-04-01' });

  const command = new ChangeResourceRecordSetsCommand({
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
  });

  try {
    return await client.send(command);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
