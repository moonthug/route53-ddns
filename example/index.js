const { runRoute53Updater } = require('../dist');

const main = async () => {
  await runRoute53Updater({
    interval: 1000 * 60 * 60 * 6,
    domainName: 'test.example.com',
    recordType: 'A',
    hostedZoneID: 'Z123FFF1232132',
    updateSNSTopicARN: 'arn:aws:sns:eu-west-2:111111111111:ip_update'
  });
};

main().catch(err => console.error(err));
