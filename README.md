# route53-ddns

A simple script to update a Route53 record when the public IP address changes. Similar to NoIP/DynDNS.

### Node

#### Install

```shell script
$ npm install route53-ddns
```

#### Usage

```js
const { runRoute53Updater } = require('route53-ddns');

const main = async () => {
  await runRoute53Updater({
    interval: 60 * 60 * 6,
    domainName: 'test.example.com',
    recordType: 'A',
    hostedZoneID: 'Z123FFF1232132',
    updateSNSTopicARN: 'arn:aws:sns:eu-west-2:111111111111:ip_update'
  });
};

main().catch(err => console.error(err));
```

`runRoute53Updater (options)`

`options`
- `interval [number]` Interval to check public IP
- `domainName [string]` domain name to update in Route 53
- `recordType [string = 'A']` Record type
- `hostedZoneID [string]` Hosted Zone ID
- `ttl [number] = 60` Record TTL
- `updateSNSTopicARN [string] = null` SNS Topic to send updates on
- `updateSNSSubjectTemplate [string] = null` SNS subject template
- `updateSNSBodyTemplate [string] = null` SNS body template
- `logger [object] = pino` A logger object with `debug`, `info`, `warn` and `error`. If not provided, `pino` is used
- `logLevel [string] = info` Log level (`pino`)

### Command Line

#### Install

```shell script
$ npm install -g route53-ddns
```

#### Usage
```shell script
$ export AWS_ACCESS_KEY_ID=xxx
$ export AWS_SECRET_ACCESS_KEY=xxx
$ export AWS_REGION=eu-west-2
$ export ROUTE53_DDNS_UPDATE_INTERVAL=21600
$ export ROUTE53_DDNS_DOMAIN_NAME=test.example.com
$ export ROUTE53_DDNS_RECORD_TYPE=A
$ export ROUTE53_DDNS_HOSTED_ZONE_ID=Z123FFF1232132
$ export ROUTE53_DDNS_UPDATE_SNS_TOPIC_ARN=arn:aws:sns:eu-west-2:111111111111:ip_update
$ route53-ddns
```

#### Accepted Environment Variables

##### Required 

```
ROUTE53_DDNS_DOMAIN_NAME
ROUTE53_DDNS_RECORD_TYPE
ROUTE53_DDNS_HOSTED_ZONE_ID
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

##### Optional

```
ROUTE53_DDNS_UPDATE_INTERVAL = 21600            # 6 Hours
ROUTE53_DDNS_UPDATE_SNS_TOPIC_ARN = null        # Disabled
ROUTE53_DDNS_RECORD_TTL = 60
ROUTE53_DDNS_LOG_LEVEL = 'info'
ROUTE53_DDNS_UPDATE_SNS_SUBJECT = '[{domainName}] Public IP Updated'
ROUTE53_DDNS_UPDATE_SNS_BODY = 'domainName: {domainName}\ncurrentPublicIP: {currentPublicIP}\nhostedZoneID: {hostedZoneID}'
```
