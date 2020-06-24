# route53-ddns


## Environment Variables

### Required 

```
ROUTE53_DDNS_DOMAIN_NAME
ROUTE53_DDNS_RECORD_TYPE
ROUTE53_DDNS_HOSTED_ZONE_ID
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

### Optional

```
ROUTE53_DDNS_UPDATE_INTERVAL = 21600            # 6 Hours
ROUTE53_DDNS_UPDATE_SNS_TOPIC_ARN = null        # Disabled
ROUTE53_DDNS_LOG_LEVEL = 'info'
ROUTE53_DDNS_UPDATE_SNS_SUBJECT = '[{domainName}] Public IP Updated'
ROUTE53_DDNS_UPDATE_SNS_BODY = 'domainName: {domainName}\ncurrentPublicIP: {currentPublicIP}\nhostedZoneID: {hostedZoneID}'
```
