---
title: Solution Architecture Discussions
date: 2020-12-07
categories: [AWS-SAA, Discussions]
tags: [Discussions]
---

## Event Processing

### Lambda, SNS and SQS

#### SQS + Lambda

![sqs-lambda](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sqs-lambda.png)

If there is a problem during the `poll` of Lamda function (there may occur like multiple polls and retries). We can create a DLQ (dead-letter queue) to store these messages


**SQS FIFO + Lambda**

![sqs-fifo-lambda](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sqs-fifo-lambda.png)

We use SQS FIFO for this case, messages are processed in order, if one message does not go through, it blocks the entire message queue.


#### SNS + Lambda

![sns-lambda](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sns-lambda.png)

With SNS, messages are asynchronously pushed to Lambda, if errors are processing one message, Lambda will retry three times, if still not work, it will discard this message, or we can set up a DLQ at the Lambda function level, for later processing


### Fan-out Pattern - Multiple SQS

![sqs-fanout](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sqs-fanout.png)



### S3 Events

Amazon S3 event notifications typically deliver events in seconds but can sometimes take a minute or longer. On very rare occasions, events might be lost


## Caching Strategies

![caching-strategies](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/caching-strategies.png)


- CloudFront: they are caching at the edge, very close to the client-side, there may be cases that caching objects are outdated, so we set up a TTL
- API Gateway: regional service, the cache will be regional
- Caching Layer: frequent queries


## High-Performance Computing (HPC)

#### Data Management & Transfer

- AWS Direct Connect
- Snowball & Snowmobile
- AWS DataSync

#### Compute & Networking

- EC2 Instances
  - CPU / GPU Optimized
- EC2 Placement Groups
  - *Cluster* for the best network performance

What's more?

#### EC2 Enhanced Networking (SR-IOV)

- Higher bandwidth, higher PPS (packet per second), lower latency
- **Elastic Network Adapter** (ENA) up to 100 Gbps


#### Elastic Fabric Adapter (EFA)

- Improved ENA for HPC, but only works for Linux
- Greate for inter-node communications, **tightly coupled workloads**
- Leverage Message Passing Interface (MPI) standard
- Bypass the underlying Linux OS to provide low-latency, reliable transport

#### Automation and Orchestration

- AWS Batch
  - supports multi-node parallel jobs, which enables you to run single jobs that span multiple EC2 instances
  - easily schedule jobs and launch EC2 instances accordingly
- AWS ParallelCluster
  - Open Source cluster management tool to deploy HPC on AWS
  - Configure with text files
  - Automate the creation of VPC, Subnet, cluster type, and instance types

