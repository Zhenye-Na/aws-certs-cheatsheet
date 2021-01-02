---
title: AWS Applications
date: 2020-10-04
categories: [AWS-SAA, AWS Applications]
tags: [AWS Applications]
---

2 types/patterns of application communication

- synchronous communications
- asynchronous / event-based (job queue)

Synchronous between applications could be problematic if there are sudden spikes of traffic (suppose, Black Friday), in this case, we can **decouple** your application by using:

- SQS: queue model
- SNS: pub/sub model
- Kinesis: real-time streaming model



## SQS: Distributed Queue System

The Queue acts as a buffer between the component *producing* and *saving* data, and the component receiving the data for processing.

![](https://d2908q01vomqb2.cloudfront.net/0716d9708d321ffb6a00818614779e779925365c/2017/03/28/Diagram2.png)

> It's a web service that gives you access to a message queue that can be used to store messages while waiting for a computer to process them. Amazon SQS is a distributed queue system that enables web service applications to quickly and reliably queue messages that one component in the application generates to be consumed by another component. A queue is a temporary repository for messages that are awaiting processing.
>
> Using Amazon SQS, you can decouple the components of an application so they run independently, easing message management between components. Any component of a distributed application can store messages in a fail-safe queue. Messages can obtain up to 256 KB of text in any format. Any component can later retrieve the messages programmatically using the Amazon SQS API.
>
> The queue acts as a buffer between the component producing and saving data, and the component receiving the data for processing. This means the queue resolves issues that arise if the producer is producing work faster than the consumer can process it, or if the producer or consumer is only intermittently connected to the network.

Types of queues in SQS:

1. **Standard Queues** (default): nearly-unlimited number of transactions per second. guarantee that a message is delivered *at least once* (or more - can have duplicate messages).
   1. **Delay Queues**: it can delay a message up to 15 mins, the default is 0, this can be overwritten using the `DelaySeconds` parameter
2. **FIFO Queues**: delivery and exactly-once processing. The order in which messages are sent and received is strictly preserved. It supports message groups.

**Note**

1. SQS is `pull-based`
2. Messages are 256 KB in size
3. Messages can be kept in the queue from 1 minute to 14 days, the default retention period is 4 days


Messages can be kept in the queue from 1 min to 14 days, the default retention period is 4 days. If a consumer does not handle the message in a `Visiblity Time Out` window (the max value is 12 hours), **the message will become available again to be available for another consumer**.

SQS supports long polling as a way to retrieve messages when they are available rather than being short polling every time.


### Producing and Consuming Messages

| Producing                                    | Consuming                                                 |
|----------------------------------------------|-----------------------------------------------------------|
| Define message body (up to 256 KB)           | **Pull** SQS for the message (up to 10 messages at a time)    |
| Add message attributes (metadata - optional) | Process the message within the `visibility timeout`       |
| Provide Delay delivery (optional)           | Delete the message using the message ID \& receipt handle |
| Return: 1) message id 2) MD5 of the body     |                                                           |


### SQS - Visibility Timeout

When a consumer polls a message from a queue, the message is "invisible" to other consumers for a defined period -> `Visibility Timeout`

- it can be from 0 seconds to 12 hours, the default value is 30 seconds
- if `Visibility Timeout` is too high (say 15 minutes), then if a consumer fails to process the message, you must wait 15 minutes before you can process it again
- if `Visibility Timeout` is too low (say 5 seconds), if the consumer need 2 minutes at least to process the message, then this message may be processed more than once


<div class="alert alert-secondary" role="alert">
  <ul>
    <li><code>ChangeMessageVisibility</code>: this API is to change the visibility timeout value while processing a message</li>
    <li><code>DeleteMessage</code>: this API is to tell SQS the message was successfully processed</li>
  </ul>
</div>


### SQS - Dead Letter Queue

If a consumer fails to process a message within the `Visibility Timeout`, the message will go back to the queue. However, we can set a *threshold* of <u>how many times a message can go back to the queue</u>, this is called **redrive policy**

After the threshold is exceeded, the message goes into a dead letter queue (DLQ)

> we have to create a DLQ first and then designate it a dead-letter queue, and we need to make sure to process the messages in the DLQ before they expire


### SQS - Long Polling

When a consumer requests message from the queue (SQS is pull-based), it can optionally "wait" for messages to arrive if there are none in the queue, this is called **Long Polling**

> Long Polling decreases the number of API calls made to SQS while increasing the efficiency and latency of the application

The wait time can be between 1 sec to 20 secs, long polling is preferable to short polling


<div class="alert alert-secondary" role="alert">
  Long Polling can be enabled at the queue level or the API level using <code>WaitTimeSeconds</code>
</div>



### SQS Messages Diagram

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sqs.svg)



### SQS - FIFO Queue

- Name of the queue must end in `.fifo`
- Lower throughput (3000 per second with batching, 300 /s without)
- Messages are processed **in order** by the consumer
- Messages are sent exactly **once**
- No per message delay (only per queue delay)
- Ability to do **content-based** de-duplication
  - if two messages' body text are both `hello-sqs`, then you can only view one message in the SQS Console
- 5-minute interval de-duplication using "Duplication ID"
- Message Groups:
  - Possibility to group messages for FIFO ordering using "Message GroupID"
  - Only one worker can be assigned per message group so that messages are processed in order
  - Message group is just an extra tag on the message


### SQS - Auto Scaling Group

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sqs-asg1.svg)

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sqs-asg2.png)


## SNS: Simple Notification Service

SNS is a web service that makes it easy to set up, operate, and send notifications from the cloud. It provides developers with a highly scalable, flexible, and cost-effective capability to publish messages from an application and immediately deliver them to subscribers or other applications.

- **Push** notifications: for devices like Android, Apple, Windows, Fire OS, ...
- It also supports notifications by SMS or email or **SQS queue** or any HTTP endpoint.
- It prevents losing messages by storing all the messages across multiple availability zones.
- Inexpensive, pay-as-you-go model with no up-front costs.


SNS allows you to group multiple recipients using **topics**. A topic is an "access point" for allowing recipients to dynamically subscribe for identical copies of the same notification. One topic can support deliveries to multiple endpoint types: grouping the iOS messages, the Android, the SMS... When you publish once to a topic, SNS delivers appropriately formatted copies of your message to each subscriber.


<div class="alert alert-secondary" role="alert">
  <p>SQS and SNS are both messaging services in AWS</p>
  <ul>
    <li>Instantaneous, push-based message delivery</li>
    <li>Simple APIs and easy integration</li>
    <li>Flexible message delivery over multiple transport protocol</li>
    <li>Inexpensive</li>
  </ul>
</div>


<div class="alert alert-primary" role="alert">
  <p>SQS and SNS are both messaging services in AWS</p>
  <ul>
    <li>SQS is pull-based</li>
    <li>SNS is push-based</li>
  </ul>
</div>


### SNS - How to publish


**Topic Publish** (within your AWS Server - using the SDK)

- Create a topic
- Create a subscription (or many)
- Publish to the topic


**Direct Publish** (for mobile apps SDK)

- Create a platform application
- Create a platform endpoint
- Publish to the platform endpoint
- Works with Google GCM, Apple APNS, Amazon ADM ...


### SNS + SQS: Fan Out

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sns-sqs-fanout.png)

- Push once in SNS, receive in many SQS
- Fully decoupled
- No data loss
- Ability to add receivers of data later
- SQS allows for delayed processing
- SQS allows for retries of work
- May have many workers on one queue and one worker on the other queue



## AWS Kinesis

> Kinesis is a managed alternative to Apache Kafka

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kinesis.png)

Amazon Kinesis is a platform on AWS to send your streaming data to. Kinesis makes it easy to load and analyze streaming data, and also providing the ability for you to build custom applications for your business needs. Data is automatically replicated to 3 AZs

There are three types of services:

- Kinesis Streams: low latency streaming ingest at scale
- Kinesis Analytics: perform real-time analytics on streams using SQL
- Kinesis Firehose: load streams into S3, Redshift, ElastiSearch


### Kinesis Streams Overview

> Producers (devices) sent the data into Kinesis streams where the data will be from <u>24 hours to 7 days</u> (Data Retention Period). The data will store the data in **shards**. A shard can process 5 transactions per second for reads, up to a max total data read rate of 2MB per second and up to 1000 records per second for writes, up to a max total data write rate of 1MB per second (including partition keys). Then consumers (EC2) will analyze this data and produce the analysis in DynamoDB or S3 or EMR or Redshift. The capacity of your stream is the sum of the capacities of its shards.

- Ability to reprocess/replay data
- Multiple applications can consume the same stream
- Real-time processing with the scale of throughput
- Once data is inserted in Kinesis, it can't be deleted (immutability)


#### Kinesis Streams Shards

![](https://i.stack.imgur.com/LzF4k.png)

- One stream is made of many different shards
- 1 MB/s or 1000 messages/s at write PER SHARD
- 2 MB/s at reading PER SHARD
- Billing is per shard provisioned, can have as many shards as you want
- Batching available or per-message calls
- The number of shards can evolve (re-shard / merge)
- **Records are ordered per shard**


#### Kinesis API - Put records

- `PutRecord` API + Partition key that gets hashed
- The same key goes to the same partition (helps with ordering for a specific key)
- Messages sent to get a "sequence number"
- Choose a partition key that is highly distributed (helps prevent "hot partition")
- Use Batching with `PutRecords` to reduce costs and increase throughput
- `ProvisionedThroughputExceeded` if we go over the limits
- Can use CLI, SDK, or producer libraries from various frameworks


#### Kinesis API - Exceptions

`ProvisionedThroughputExceeded` Exception

this happens when sending more data (exceeding MB/s or TPS for any shard), make sure you don't have a hot shard (such as your partition key is bad and too many data goes to that partition)

Solution

- retries with backoff
- increase shards (scaling)
- ensure your partition key is a good one


#### Kinesis API - Consumers

- can use a normal consumer (CLI, SDK, etc..)
- can use Kinesis Client Library (KCL)
  - KCL uses DynamoDB to checkpoint offsets
  - KCL uses DynamoDB to track other workers and share the work amongst shards


### Kinesis Data Firehose

> Producers (devices) sent the data into Kinesis Firehose which will analyze the data directly using lambda to be stored in S3 or any other storage. Here, there is no data persistence.

- Fully managed service, no administration, automatic scaling, serverless
- Load data into Redshift / Amazon S3 / ElasticSearch / Splunk
- Near Real-Time
  - 60 seconds latency minimum for non-full batches
  - or minimum of 32 MB of data at a time
- Supports many data formats. conversions, transformations, compression
- Pay for the amount of data going through Firehose


**Kinesis Data Streams vs Firehose**

| Kinesis Data Streams                                             | Kinesis Firehose                                           |
|------------------------------------------------------------------|------------------------------------------------------------|
| Going to write custom code (producer \& consumer)                | Fully managed, send to S3, Splunk, Redshift, ElasticSearch |
| Real-time (~ 200ms)                                              | Serverless data transformations with Lambda                 |
| Must manage to scale (shard splitting/merging)                  | **Near** real-time (lowest buffer time is 1 minute)        |
| Data Storage for 1 to 7 days, replay capability, multi consumers | Automated Scaling                                          |
|                                                                  | No data storage                                            |



### Kinesis Data Analytics

> This is a combination of Streams with Firehose.

Perform real-time analytics on Kinesis Streaming using SQL

Kinesis Data Analytics has features like

- Auto Scaling
- Fully Managed, no servers to provision
- Continuous: real-time

Pay for actual consumption rate and can create streams out of the real-time queries


### Kinesis Security

- Control access/authorization using IAM policies
- Encryption is flight using HTTPS endpoints
- Encryption at rest using KMS
- Possibility to encrypt/decrypt data from client-side (harder)
- VPC Endpoints available for Kinesis to access with VPC



## SQS vs SNS vs Kinesis

| SQS                                             | SNS                                                 | Kinesis                                         |
|-------------------------------------------------|-----------------------------------------------------|-------------------------------------------------|
| Consumer "pull data"                            | Push data to many subscribers (Pub / Sub)           | Consumers "pull data"                           |
| Data is deleted after being consumed            | Up to 10,000,000 subscribers and 100,000 topics     | As many consumers as we want                    |
| Can have as many workers (consumers) as we want | Data is not persisted (lost if not delivered)       | Possibility to replay data                      |
| No need to provision throughput                 | No need to provision throughput                     | Meant for real-time big data, analytics, and ETL |
| No ordering guarantee (except FIFO queues)     | Integrates with SQS for fanout architecture pattern | Ordering at the shard level                      |
| Individual message delay capability             |                                                     | Data Expires after X days                       |
|                                                 |                                                     | Must provision throughput                      |


## Amazon MQ

> Amazon Managed Apache ActiveMQ

A traditional application running from on-premise may use open protocols such as `MQTT`, `AMQP`, `STOMP`, `Openwire`, `WSS`

Amazon MQ:

- does not scale as much as SQS / SNS
- it runs on a dedicated machine, can run in HA with a failover
- it has both queue feature (~ SQS) and topic features (~ SNS)
