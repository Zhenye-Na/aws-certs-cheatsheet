---
id: chapter08
title: AWS Applications
sidebar_label: AWS Applications
---

# AWS Applications

## SQS: Distributed Queue System

The Queue acts as a buffer between the component producing and saving data

> It's a web service that gives you access to a message queue that can be used to store messages while waiting for a computer to process them. Amazon SQS is a distributed queue system that enables web service applications to quickly and reliably queue messages that one component in the application generates to be consumed by another component. A queue is a temporary repository for messages that are awaiting processing.
> 
> Using Amazon SQS, you can decouple the components of an application so they run independendly, easing message management between components. Any component of a distributed application can store messages in a fail-safe queue. Messages can obtain up to 256 KB of text in any format. Any component can later retrieve the messages programmatically using the Amazon SQS API.
> 
> The queue acts as a buffer between the component producing and saving data, and the component receiving the data for processing. This means the queue resolves issues that arise if the producer is producing work faster than the consumer can process it, or if the producer or consumer are only intermittently connected to the network.

There are two types of queues:

1. Standard Queues (default): nearly-unlimited number of ttransactions per second. Guarantee that a message is delivered at least once (or more!).
2. FIFO Queues: delivery and exactly-once processing. The order in which messages are sent and received is stringly preserved. It supports message groups.

Messages can be kept in the queue from 1 min to 14 days, the default retention period is 4 days. If a consumer does not handle the message in a Visiblity Time Out window (the max value is 12 hours), the message will became available again to be available for another consumer.

SQS supports long polling as a way to retrieve messages when they are available rather than being short polling every some time.

:::tip

1. SQS is pull-based
2. Messages are 256 KB in size
3. Messages can be kept in the queue from 1 minute to 14 days the default retrntion period is 4 days

:::


## SWF: Simple Work Flow Service

SWF is a web service that makes it easy to coordinate work across distributed application components. SWF enables applications for a range of use cases, including media processing, web application back-ends, business process workflows, and analytics pipelines, to be designed as a coordination of tasks. A task is an invocation of various processing steps in an application which can be performed by executable code, web service calls, human actions, and scripts.

- The retention period can last up to 1 year.
- SWF ensures that a task is assigned only once and is never duplicated. (SQS can end up with duplicated messages)
- SWF keeps track of all the tasks and events in an application (this is not supported by SQS).

The main concepts:

- Workflow Starters (triggers)
- Deciders: control the flow of activity tasks in a workflow execution. If something has finished (or failed) in a workflow, a Decider decides what to do next.
- Activity Workers: carry out the activity tasks.
- Domain: collection of related workflows.

## SNS: Simple Notification Service

SNS is a web service that makes it easy to set up, operate, and send notifications from the cloud. It provides developers with a highly scalable, flexible, and cost-effective capability to publish messages from an application and immediately deliver them to subscribers or other applications.

- Push notifications: for devices like Android, Apple, Windows, Fire OS, ...
- It also supports notifications by SMS or email or SQS queue or any HTTP endpoint.
- It prevents losing messages by storing all the messages across multiple availability zones.
- Inexpensive, pay-as-you-go model with no up-front costs.


SNS allows you to group multiple recipients using topics. A topic is an “access point” for allowing recipients to dynamically subscribe for identical copies of the same notification. One topic can support deliveries to multiple endpoints types: grouping the IOS messages, the Android, the SMS… When you publish once to a topic, SNS delivers appropriately formatted copies of your message to each subscriber.



:::tip

- Instanteneous, push-based message delievery
- Simple APIs and easy integration
- Flexible message delievery over multiple transport protocol
- Inexpensive

:::


:::important

They are both messaging services in AWS, SQS is pull-based, SNS is push-based

:::


## Elastic Transcoder


- This is a Media transcoder in the cloud
- convert media files from their original source format in to different formats that will play on smartphones, tablets, PCs, etc.
- It provides transcoding presets for popular output formats, which means that you don't need to guess about which settings work best on particular devices.
- Pay based on the minutes that you transcode and the resolution at which you transcode.

:::note

How to use it:

store media files in S3 -> trigger an action in lambda -> run elastic transcoder -> destination of output in s3.

Media transcoder convert media files from original formats to other compatible formats

:::


## API Gateway

API Gateway is a fully managed service that makes it easy for developers to publish, maintain, monitor and secure APIs at any scale.


- Expose HTTPS endpoints to define a RESTful API
- Serverless-ly connect to services like Lambda & DynamoDB
- Send each API endpoint to a different target
- Run efficiently with low cost
- Scale effortlessly: scale automatically along with your traffic
- Track and control usage by API key
- Throttle requests to prevent attacks
- Connect to CloudWatch to log all requests for monitoring
- Maintain multiple versions of your API


We can enable API caching to cache your endpoint’s response. With caching, we can reduce the number of calls made to your endpoint and also improve the latency of the requests to your API. When you enable caching for a stage, API Gateway caches from your endpoint for a specified time-to-live (TTL) period, in seconds. API Gateway then responds to the request by looking up the endpoint response from the cache instead of making a request to your endpoint.



:::note

Security

- Cross Site Scripting In computing, the same-origin policy is an important concept in the web application security model. Under the policy, a web browser permits scripts contained in a first web page to access data in a second web page, but only if both web pages have the same origin. This will prevent cross-site scripting (XSS) attacks.
- CORS CORS is one way the server at the other end (not the client code in the browser) can relax the same origin policy. Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served.

:::



## Kinesis 101

Amazon Kinesis is a platform on AWS to send your streaming data to. Kinesis makes it easy to load and analyze streaming data, and also providing the ability for you to build your own custom applications for your business needs.

There are three types:

- Kinesis Streams
- Kinesis Firehose
- Kinesis Analytics


### Kinesis Streams

Producers (devices) sent the data into Kinesis streams where the data will be from 24 hours to 7 days. The data will store the data in shards. A shard is able to process 5 transactions per second for reads, up to a max total data read rate of 2MB per second and up to 1000 records per second for writes, up to a max total data write rate of 1MB per second (including partition keys). Then consumers (EC2) will analyse this data and produce the analysis in DynamoDB or S3 or EMR or Redshift. The capacity of your stream is the sum of the capacities of its shards.

### Kinesis Firehose

Producers (devices) sent the data into Kinesis Firehose which will analyse the data directly using lambda to be stored in S3 or any other storage. Here, there is no data persistence.

### Kinesis Analytics

This is a combination of Streams with Firehose.



## Cognito: Web Identity Federation

Web Identity Federation lets you give your users access to AWS resources after they have successfully authenticated with a web-based identity provider like Amazon, Facebook, or Google.

- Sign-up and sign-in to your apps
- Access for guest users
- Acts as an Identity Broker between your application and Web ID providers, so you don’t need to write any additional code
- Syncrhonizes user data for multiple devices
- Recommended for all mobile applications AWS services

Cognito brokers between the app and Facebook or Google to provide temporary credentials which map to an IAM role allowing access to the required resources. No need for the application to embed or store AWS crendentials locally on the device and it gives users a seamless experience across all mobile devices.

**User Pools** are user directories used to manage sign-up and sign-in functionality for mobile and web applications. Users can sign-in directly to the User Pool, or using Facebook, Amazon, or Google. Cognito acts as an Identity Broker between the identity provider and AWS. Successful authentication generates a JSON Web Token.

**Identity Pools** provides temprary AWS credentials to access AWS services like S3 or DynamoDB.

### Synchronisation

Cognito tracks the association between user identity and the various different devices they sign-in from. In order to provide a seamless user experience for your application, Cognito uses Push Synchronization to push updates and synchronize user data across multiple devices. Cognito uses SNS is to send a notification to all the devices associated with a given user identity whenever data stored in the cloud changes.


