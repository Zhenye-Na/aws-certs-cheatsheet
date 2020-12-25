---
id: chapter14
title: Disaster Recovery in AWS
sidebar_label: DR
---

## Disaster Recovery Overview

- ANy event that has a negative impact on a company's business continuity or finances is a disaster
- Disaster Recovery (DR) is about preparing for and recovering from a disaster


:::info

**RPO and RTO**

- RPO: Recovery Point Objective
- RTO: Recovery Time Objective

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/rpo-rto.png)

:::



## Disaster Recovery Stategies

- Backup and Restore
- Pilot Light
- Warm Standby
- Hot Site / Multi Site Approach

![](https://jayendrapatil.com/wp-content/uploads/2016/03/Disaster-Recovery.png)

### Backup and Restore

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/backup-and-restore.png)

High RPO, High RTO

### Pilot Light

A small version of the app is always running in the cloud. It is useful for the critical core (pilot light)

Similar to Backup and Restore, faster than Backup and Restore as critical systems are already up


### Warm Standby

Full system is up and running, but at minimum size. Upon disaster, we can scale to production load

### Multi Site / Hot Site Approach

- Very low RTO - very expensive
- Full Production Scale is running AWS and On Premise


:::tip

- **Backup**
  - EBS Snapshots, RDS automated backups / Snapshots, etc..
  - Regular pushes to S# / S3 IA / Glacier, Lifecycle Policy, Cross Region- Replication
  - From On-premise: Snowball or Storage Gateway
- **High Availability**
  - Use Route53 to migrate DNS over from Region to Region
  - RDS Multi-AZ, ElastiCache Multi-AZ, EFS, S3
  - Site to Site VPC as a recovery from Direct Connect
- **Replication**
  - RDS Replication (Cross Region), AWS Aurora + Global Databases
  - Database replication from on-premise to RDS
  - Storage Gateway
- **Automation**
  - CloudFormation / Elastic Beanstalk to re-create a whole new environment
  - Recover / Reboot EC2 instances with CloudWatch if alarms fail
  - AWS Lambda functions for customized automations
- **Chaos**
  - Netflix has a "simian-army" randomly terminating EC2

:::


## DMS - Database Migration Service


- Quickly and securely migrate databases to AWS, resilient, self healing
- The source database remains available during the migration
- Supports
  - Homogeneous migrations
  - Heterogeneous migrations
- Continuous Data Replication using CDC (Change Data Capture)
- You must create an EC2 instance to perform the replication task


### DMS Sources and Targets

![dms-source-and-target](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/dms-source-and-target.png)


### AWS Schema Conversion Tool (SCT)

Convert your Database's Schema from one engine to another. You do not need to use SCT if you are migrating the same DB engine


## AWS DataSync

- Move large amount of data from on-premise to AWS
- Can synchronize to: S3, EFS, FSx from Windows
- Move data from your NAS or file system via NFS or SMB
- Replication tasks can be scheduled
- Leverage the DataSync agent to connect to your systems


## Transferring large amount of data in AWS

Example: transfer 200TB of data in the cloud. We have a 100 Mbps internet connection

Several methods:

- Site to Site VPN
- Direct Connect
- Snowball
- On-goiing replication / transfer: Site-to-Site VPC or DX with DMS or DataSync

