import { SNS } from 'aws-sdk';

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
  const sns = new SNS({ apiVersion: '2010-03-31' });

  const params = {
    Message: options.message,
    Subject: options.subject,
    TopicArn: options.topicARN
  };

  try {
    return await sns.publish(params).promise();
  } catch (e) {
    console.error(e);
    throw e;
  }
};
