#!/usr/bin/env node
const assert = require('assert');
const { runRoute53Updater } = require('../dist');

// AWS
assert(process.env.AWS_ACCESS_KEY_ID, 'AWS_ACCESS_KEY_ID not set in environment');
assert(process.env.AWS_SECRET_ACCESS_KEY, 'AWS_SECRET_ACCESS_KEY not set in environment');
assert(process.env.AWS_REGION, 'AWS_REGION not set in environment');

// APP
assert(process.env.ROUTE53_DDNS_DOMAIN_NAME, 'ROUTE53_DDNS_DOMAIN_NAME not set in environment');
assert(process.env.ROUTE53_DDNS_RECORD_TYPE, 'ROUTE53_DDNS_RECORD_TYPE not set in environment');
assert(process.env.ROUTE53_DDNS_HOSTED_ZONE_ID, 'ROUTE53_DDNS_HOSTED_ZONE_ID not set in environment');


const interval = process.env.ROUTE53_DDNS_UPDATE_INTERVAL
  ? parseInt(process.env.ROUTE53_DDNS_UPDATE_INTERVAL) / 1000
  : 1000 * 60 * 60 * 6;

runRoute53Updater({
  interval,
  domainName: process.env.ROUTE53_DDNS_DOMAIN_NAME,
  recordType: process.env.ROUTE53_DDNS_RECORD_TYPE,
  hostedZoneID: process.env.ROUTE53_DDNS_HOSTED_ZONE_ID,
  updateSNSTopicARN: process.env.ROUTE53_DDNS_UPDATE_SNS_TOPIC_ARN
})
.catch(console.error);
