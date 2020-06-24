#!/usr/bin/env node
const assert = require('assert');

const pino = require('pino');

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

//
// Logger
const logger = pino({
  appName: 'route53-ddns',
  level: process.env.ROUTE53_DDNS_LOG_LEVEL || 'info'
});

//
// Run
runRoute53Updater({
  interval,
  logger,
  domainName: process.env.ROUTE53_DDNS_DOMAIN_NAME,
  recordType: process.env.ROUTE53_DDNS_RECORD_TYPE,
  hostedZoneID: process.env.ROUTE53_DDNS_HOSTED_ZONE_ID,
  updateSNSTopicARN: process.env.ROUTE53_DDNS_UPDATE_SNS_TOPIC_ARN,
  updateSNSSubjectTemplate: process.env.ROUTE53_DDNS_UPDATE_SNS_SUBJECT,
  updateSNSBodyTemplate: process.env.ROUTE53_DDNS_UPDATE_SNS_BODY
})
.catch(pino.final(logger, (err, finalLogger) => {
  finalLogger.error(err, 'uncaughtException');
  process.exit(1)
}));

