---
title: Other Services in AWS
date: 2020-12-05
categories: [AWS-SAA, Other Services]
tags: [Other Services]
---

## CI/CD

![aws-cicd](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/aws-cicd.png)

## CloudFormation

> Infrastructure as Code, Terraform type-thing

CloudFormation is a declarative way of outlining your AWS Infrastructure, for any resources. It will create those resources for you, in the correct order, with the exact configuration that you specify


### How CloudFormation works?

- Templates have to be uploaded in **S3** and then references in CloudFormation
- To update a template, we cannot edit previous ones. We have to re-upload a new version of the template to AWS
- Stacks are identified by a name
- Delete a stack, will delete every single artifact that was created by CloudFormation


### Deploying CloudFormation templates

- Manual way
  - edit the templates in CloudFormation Designer
- Automated way
  - using AWS CLI to deploy the templates in the YAML file



### CloudFormation - StackSets

- create, update or delete stacks across **multiple accounts and regions** with a single operation
- administrator account to create StackSets
- when you update a StackSet, **all** associated stack instances are updated throughout all accounts and regions


## ECS - Elastic Container Service

IAM security and roles are at the ECS task level

![ecs-cluster](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/ecs-cluster.png)

- ECS Cluster
  - set of *EC2 instances*
- ECS Service
  - applications definitions running on ECS Cluster
- ECS Tasks + Definition
  - containers running to create the application
- ECS IAM roles
  - roles assigned to *tasks* to interact with AWS


### ALB integration

- direct integration feature with ECS: port mapping
- allows you to run multiple instances of the same application on the same EC2 instance


## ECR - Elastic Container Registry

> Managed DockerHub

- Store. managed and deploy your containers on AWS
- Fully integrated with IAM & ECS
- Sent over HTTPS (encryption in flight) and encrypted at rest


## ECS - IAM Task Roles

![ecs-iam-task-roles](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/ecs-iam-task-roles.png)



## ECS Fargate

ECS Cluster is together with EC2 Instances. but with ECS Fargate, it becomes **serverless**

no need to provision EC2 instances, we just create task definitions and AWS will run our containers for us

## SWF: Simple Work Flow Service

- Build serverless visual workflow to orchestrate your Lambda functions
- Represent flow as a JSON **state machine**
- integrate with EC2, ECS, API Gateway, On-premise servers ...
- Maximum execution time of 1 year
- Code runs on EC2


The main concepts:

- Workflow Starters (triggers)
- Deciders: control the flow of activity tasks in a workflow execution. If something has finished (or failed) in a workflow, a Decider decides what to do next.
- Activity Workers: carry out activity tasks.
- Domain: a collection of related workflows.


SWF is a web service that makes it easy to coordinate work across distributed application components. SWF enables applications for a range of use cases, including media processing, web application back-ends, business process workflows, and analytics pipelines, to be designed as coordination of tasks. A task is an invocation of various processing steps in an application that can be performed by executable code, web service calls, human actions, and scripts.

- The retention period can last up to 1 year.
- SWF ensures that a task is assigned only once and is never duplicated. (SQS can end up with duplicated messages)
- SWF keeps track of all the tasks and events in an application (this is not supported by SQS).


## AWS EMR (Elastic MapReduce)

EMR takes care of provisioning and configurations of the EC2 instances (large amount)

## AWS Glue

It is an ETL Service, serverless

Automated Code Generation, supports Aurora, RDS, RedShift, and S3

**Glue Data Catalog**: Metadata (definition and Schema) of the Source Tables


## AWS Opsworks

> Managed Chef & Puppet

perform server configuration automatically

the alternative to AWS SSM

## Elastic Transcoder

- This is a *Media Transcoder* in the cloud
- convert media files (stored in **S3**) from their source format into different formats that will play on smartphones, tablets, PCs, etc.
- It provides transcoding presets for popular output formats, which means that you don't need to guess about which settings work best on particular devices.
- Pay based on the minutes that you transcode and the resolution at which you transcode.

4 Components

- Jobs: work type
- Pipeline: queue that manages the transcode job
- Presets: template for converting, like resolution, size ...
- Notifications: SNS or ...


<div class="alert alert-secondary" role="alert">
  <p>How to use it:</p>
  <p>store media files in S3 -&gt; trigger an action in lambda -&gt; run elastic transcoder -&gt; destination of output in s3.</p>
  <p>Media transcoder convert media files from original formats to other compatible formats</p>
</div>


## AWS AppSync

> Managed GraphQL


Store and sync data across mobile and web apps in real-time

Integration with DynamoDB and Lambda

Support offline data sync (replaces Cognito Sync)
