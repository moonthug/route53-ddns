import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

/**
 *
 */
interface ISendSNSOptions {
  message: string;
  topicARN: string;
  subject: string;
}

/**
 *
 * @param options
 */
export const sendSNS = async (options: ISendSNSOptions) => {
  const client = new SNSClient({ apiVersion: '2010-03-31' });

  const command = new PublishCommand({
    Message: options.message,
    Subject: options.subject,
    TopicArn: options.topicARN
  });

  try {
    return await client.send(command);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
