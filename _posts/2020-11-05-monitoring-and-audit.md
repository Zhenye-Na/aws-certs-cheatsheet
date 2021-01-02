---
title: AWS Monitoring, Troubleshooting and Audit
date: 2020-11-05
categories: [AWS-SAA, Monitoring and Audit]
tags: [Monitoring, Audit]
---


> CloudWatch, CloudTrail, and Config

## AWS CloudWatch

**AWS CloudWatch** is a monitoring service to monitor your AWS resources, as well as the applications that you run on AWS. Metrics like CPU, network, disk, status check.


- CloudWatch is about monitoring performance.
  - e.g. CloudWatch with EC2 will monitor events every 5 minutes by default.
- You can have 1-minute intervals by turning on detailed monitoring.
- You can create CloudWatch alarms that trigger notifications.


**What can CloudWatch do?**

- **Dashboards**: Creates awesome dashboards to see what is happening with your AWS environment.
- **Alarms**: This allows you to set alarms that notify you when particular thresholds are hit.
- **Events**: Helps you to respond to state changes in your AWS resources.
- **Logs**: Aggregates log data.


CloudWatch can monitor:

1. **Compute Resources**: EC2 Instances, Autoscaling Group, Elastic Load Balancers, Route53 Health Check
2. **Storage & Content Delivery**: EBS Volumes, Storage Gateways, CloudFront


### CloudWatch Metrics

- CloudWatch provides metrics for **every** service in AWS
- **Metric** is a variable to monitor (CPU Utilization, Network ..)
- Metrics belong to **namespaces**
- **Dimension** is an attribute of a metric (instance id, environment, etc..)
- Up to 10 dimensions per metric
- Metrics have **timestamps** (time series data)
- CloudWatch dashboard of metrics

#### Custom Metrics

- Possibility to define and send your custom metrics to CloudWatch
- Ability to use dimensions (attributes) to segment metrics, like, `Instance.id`, `Environment.name`
- Metric Resolution
  - Standard: 1 minute
  - High Resolution: up to 1 second (`StorageResolution` API parameter), but it costs higher
- Use API call `PutMetricData`, (must be pushed from inside the instance as a custom metric)

### CloudWatch Dashboards

- Great way to set up dashboards for quick access to keys metics
- **Dashboards are global**
- **Dashboards can include graphs from different Regions**
- You can change the timezone & time range of the dashboards
- You can set up automatic refresh (10s, 1m, 2m, 5m ...)

> You can get 3 dashboards (up to 50 metrics) for free, $3 / dashboard / month afterwards

### CloudWatch Logs

Applications can send all kinds of logs to CloudWatch using the SDK

CloudWatch can collect logs from Elastic Beanstalk, ECS, AWS Lambda, VPC Flow Logs, API Gateway, CloudTrail, CloudWatch, Route53 ...

CloudWatch Logs can go to:

- Batch export to S3 for archival
- Stream to ElasticSearch cluster for further analytics

Logs storage architecture:

- **Log Groups**: arbitrary name, usually representing an application
- **Log Stream**: instances within application / logfiles / containers

You can define *log expiration policies*, with AWS CLI we can tail CloudWatch logs.

To send logs to CloudWatch, we should make sure IAM permissions are correct.

CloudWatch Logs Security: encryption of logs using **KMS at the Group level**


#### CloudWatch Logs Metric Filter & Insights

CloudWatch Logs can use filter expressions

- For example, find a specific IP inside of a log
- Metric filters can be used to trigger alarms


### CloudWatch Alarms

- Alarms are used to trigger notifications for any metric
- Alarms can go to Auto Scaling Group, EC2 Actions, SNS Notifications
- Various options (sampling, ratio, min/max, etc..)
- Alarm States:
  - `OK`
  - `INSUFFICIENT_DATA`
  - `ALARM`
- Period
  - Length of time in seconds to evaluate the metric
  - High-resolution custom metrics: can only choose 10s or 30s


### CloudWatch Events

- Schedule: Cron jobs
- Event Pattern: Event rules to react to a service doing something
  - for example, CodePipline state changes.
- Triggers to Lambda functions, SQS/SNS/Kinesis Messages
- CloudWatchEvent creates a small JSON document to give information about the change


## AWS CloudTrail

CloudTrail provides governance, compliance, and audit for your AWS **Account**, CloudTrail is enabled by default

It can:

- Get a history of events / API calls made within your AWS Account by
  - AWS Console
  - SDK
  - CLI
  - AWS Services
- Can put logs from CloudTrail to CloudWatch Logs


> If a resource is detected in AWS, look into CloudTrail first

**AWS CloudTrail** increases visibility into your user and resource activity by <u>recording AWS Management Console actions and API calls</u>. You can identify which users and accounts are called AWS, the source IP address from which the calls were made, and when the calls occurred.


## AWS Config

Config will help with **auditing and recording compliance of your AWS Resources**

- record configurations and changes over time
- possibility of storing the configuration data into S3, (you can analyze with Athena)
- with AWS Config
  - restricted SSH access to my security groups
  - bucket public access?
  - ALB configuration changed over time
- you can receive alerts (SNS notifications) for any changes
- AWS Config is a per-region service
- can be aggregated across regions and accounts

### AWS Config Rules

AWS Config Rules does not prevent actions from happening (There is no deny rules)

- use AWS managed Config rules
- make custom config rules
- rules can be evaluated or triggered
  - for each config change
  - regular time intervals
  - can trigger CloudWatch Events if the rule is non-compliant (and chain with Lambda)
- can have auto remediations
  - if a resource is not compliant, you can trigger an auto-remediation

> $2 per active rule per Region per month

## CloudWatch vs CloudTrail vs Config

### CloudWatch

- Performance monitoring (metrics like CPU usage, Network, RAM) & Dashboard visualization
- Events and Alerting
- Log Aggregation & Analysis

### CloudTrail

- Record API calls made within your **Account** by everyone
- Can define trails for specific resources
- CloudTrail is a Global Service


<div class="alert alert-success" role="alert">
  <ol>
    <li>CloudWatch is used for monitoring performance</li>
    <li>CloudWatch can monitor most of AWS as well as your applications that run on AWS</li>
    <li>CloudWatch with EC2 will monitor events every 5 minutes by default</li>
    <li>But you can have a 1-minute interval by turning on detailed monitoring</li>
    <li>You can create CloudWatch alarms that trigger notifications</li>
    <li>CloudWatch is all about <strong>Performance</strong>, CloudTrail is all about <strong>Auditing</strong></li>
  </ol>
</div>


### Config

- Record configuration changes
- Evaluate resources against compliance rules
- Get a timeline of changes and compliance
