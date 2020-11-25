---
id: chapter05
title: Database on AWS
sidebar_label: RDS
---

> We will cover Relational Database Service (RDS) on AWS, together with AWS Aurora, DynamoDB, RedShift and ElastiCache

# Database on AWS

database types which are supported by AWS:

- Postgres
- MySQL
- MariaDB
- Oracle
- Microsoft SQL Server
- Aurora (* AWS Proprietary database)

RDS is a managed service:

- Automated provisioning, OS patching
- Continuous backups and restore to specific timestamp (Point in TIme Restore)
- Monitoring dashboard
- Read replicas for improved read performance
- Multi-AZ setup for Disaster Recovery
- Maintenance windows for upgrades
- Scaling capability (vertical and horizontal)
- Storage backed by EBS (gp2 or io1)

**BUT, you cannot SSH into your instances**


## RDS Overview

There are two important features for RDS

- Multi-AZ: this is for "Disaster Recovery"
- Read Replicas: this is for "Improving Performance"

**OLTP vs OLAP**

OLAP is for Data Warehousing on AWS (a different type of architecture both from a database perspective and infrastructure layer)

**ElasticCache**

This is a service for web app, it is easy to deploy, operate and scale an *in-memory cache* in the cloud.

It speeds up the performace of existing databases' frequent identical queries

**RedShift**

This is for BI / Data warehousing -> OLAP usage

**Relational Database**

- RDS runs on virtual machine, but you cannot ssh to it
- **RDS is NOT serverless, BUT Aurora Serverless IS Severless**


## RDS - Backups, Multi-AZ & Read Replicas

### Backups

There are two types of Backups for RDS

1. Automated Backups
2. Database Snapshots

#### Automated Backups

It allows user to receover your database to any point in time within a  "Retention Period", this is around 7 ~ 35 days.

Automated backup is enabled by default, the backup data is stored in S3, meanwhile, the size of your RDS is equal to the size of S3

:::note

Automated backups:

- Daily full backup of the database (during the maintenance window)
- Transaction logs are backed-up by RDS every 5 minutes
- This gives the ability to resotre to any pooint in time (from oldest backup to 5 minutes ago)

:::


#### Database Snapshot

Database Snapshot are stored even after you delete the original RDS Instance

Bur it is manually trigered by the user, and retention of backup for as long as you want


### Multi-AZ

- It has only one DNS name, automatic app failover to standby, no manual intervention in apps
- This is an exact copy of your production databse in `another AZ`
- Automactically synchronized when your prod database is written to
- In the event of the following:
  - planned database maintenance
  - DB instance failure
  - AZ failure
  - Netowrk failure

This is only for **Disaster Recovery**, increase *availability*


### Read Replicas

This allows you to have a read-only copy of your production database.

This is achieved by using **asynchronously** replication from the primary RDS Insntace to the Read Replicas. It is better for those database with heavy read workloads

> Read replicas are used for SELECT (or read) only kind of tasks, not INSERT, DELETE or UPDATE

:::tip

Be careful for the difference between Read Replicas and the previous database backup methods

1. Read Replica is for scaling, for performance improvements
2. In order touse Read Replicas, you should turn on the setting for "Automated Backups"
3. You can have up to 5 Read replicas of any database
4. You can even have Read replicas of Read replicas
5. Each Read replicas has its own Endpoint
6. Read replicas can be prompted to be their own database, but replications wont work

:::

#### Read Replicas - Network Cost

In AWS, there is a network cost when data goes from one AZ to another, so in order to reduce cost, you can have your Read Replicas in the same AZ


## RDS Securities

### Encryptions

This is achieved by using AWS KMS (Key Management Service), once the ecryption is on, the followings are encrypted:

- data underlying storage
- automated backups
- read replicas
- database snapshots

:::tip

Whenever you restore either an Automated Backup or Database Snapshot, the restored version of the database will be a **new** RDS instance with a **new** DNS endpoint

:::

#### At rest encryption and In-flight encryption

**At rest encryption**

We can encrypt the primary db and read replicas with AWS KMS - AES - 256 encryption, this has to be defined at launch time.

If the primary db is not enrypted, the read replicas cannot be encrypted

> or, unencrypted DB -> snapshot -> copy snapshot as encrypted -> create new DB from encrypted snapshot

Transparent Data Encryption (TDE) available for Oracle and SQL Server

**In-flight encryption**

This allows to use SSL Certificates to encrypt data to RDS in flight, you have to provide SSL options with trust certificate when connecting to database


### Network & IAM

**Network Security**

- RDS databases are usually deployed with a private subnet, not in a public one
- RDS security works by leveraging security groups, it controls which IP / security group can **communicate** with RDS

**Access Management**

- IAM policies helo control who can manage AWS RDS through the RDS API, like "who can create a read replica ? etc.."
- traditional username/password can be used to log into the database
- IAM-based authentication can be used to login to RDS MySQL & PostgreSQL

#### IAM Authentication

- works with MySQL & PostgreSQL
- no need for password, just a token obtained through IAM & RDS API call
- the token has a lifetime of 15 minutes

the IAM Authentication has the following benefits:

- Network in/out must be encrypted using SSL
- IAM to centrally manage users instead of DB
- Can leverage IAM Roles and EC2 Instance profiles for easy integration


## Aurora

Aurora is the MySQL compatible, AWS solution to Relational Database

### Aurora HA and Scalability

:::important

Aurora always maintains **2 copies of your data in each AZ**, with a **minimum of 3 AZ** => which leads to **6 copies** of your data

Among these 6 copies of your data across 3 AZ:

-  4 copies out of 6 needed for writes
-  3 copies out of 6 needed for reads
-  self healing with peer-to-peer replication
-  storage is striped across 100s of volumes

:::

There is a `primary-secondary` architecture, one Aurora instance will take writes (`primary`)

If there is a failover happened, the automated failover for primary db will take effect in less than 30 seconds

You can have up to 15 Aurora Read Replicas serve reads, the read replicas support Cross Region Replication

### Aurora Replicas

There are 2 types of Aurora Replicas

1. Aurora Replicas
2. MySQL Read Replicas

> Automated failover is only available with Aurora Replics

Backups for Aurora, also 2 types:

1. Automated Backups
2. Data Snapshots

:::note

In order to migrate data from MySQL to Aurora, you can do the following things

- take a data snapshot and restore in Aurora
- create an Aurora Read replica and then promote the Read Replica as a "database service"

:::


### Aurora DB Cluster

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/aurora-db-cluster.png)

> load balancing happens during connection


### Aurora Serverless

- Automated database instantiation and autoscaling based on actual usage
- good for infrequent, intermittent or unpridictable workloads
- no capacity planning needed
- pay per second, can be more cost effective

> Aurora Serverless will create Aurora instance, and client will connect to Aurora with `Proxy Fleet`, with auto-scaling turned on, which means: if the QPS is large, then more Aurora instances will be created, otherwise, will be deleted


### Global Aurora

- Aurora Cross Region Read Replicas
  - Useful for disaster recovery
  - Simple to put in place
- Aurora Global Database (recommended)
  - 1 Primary Region (read / write)
  - Up to 5 secondary (read-only) regions, replication lag is less than 1 second
  - Up to 16 Read Replicas per secondary region, helps for decreasing latency
  - Promoting another region (for disaster recovery) has an RTO (Recovery Time Objective) of < 1 minute


## ElastiCache

This is the AWS solution to web-service-based in-memory cache

### ElasticCache Overview

- The same way RDS is to get managed Relational Databases
- ElastiCache is to get managed Reids or Memcached
- Helps reduce load off of databases for read intensive workloads
- make application stateless
- Write Scaling using **Sharding**
- Read Scaling using **Read Replicas**
- Multi-AZ with failover Capability
- AWS takes care of OS maintenance / pathcing, optimizations, setup, configuration, monitoring, failure recovery and backups

#### DB Cache

![](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a79a64a389ab1c9f/2019/10/01/Caching-for-performance-A.jpg)

> Application queries ElastiCache first, if data is not available (cache miss) then get data from RDS and store in ElastiCache, so that for the later quries, it will reach cache hit

#### User Session Store

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/user-session-store.svg)

- User log into any of the application
- The application writes the session data into ElastiCache
- The user hits another instance of our application
- The instance retrieves teh data and the user is already logged in


### ElastiCache - Redis or Memcached

| Redis                                                   | Memcached                                      |
|---------------------------------------------------------|------------------------------------------------|
| **Multi-AZ** with Auto-Failover                         | Multi-node for partitioning of data (sharding) |
| Read Replicas to scale reads and have high availability | **Non persistent**                             |
| Data Durability using AOF persistence                   | **No backup and restore**                      |
| Backup and restore feature                              | Multi-threaded architecture                    |

- If you need scale horizontally, you need choose Memcached
- If you need Multi-AZ, Backups and Restores, you need choose Redis

:::tip

Right now, we have two methods of improving performance

1. ElasticCache -> Cache layer to speed up
2. Read Replicas -> Improved read/write on database layer

:::


### ElastiCache - Cache Security

All caches in ElastiCache:

- support SSL in flight encryption
- **Do not support IAM authentication**
- IAM policies on ElastiCache are only used for AWS API-level security


**Redis AUTH**

- You can set a "password/token" when you create a Redis Cluster
- This is an extra level of security for you cache (on top of Security Group)

Memcached

- Supports SASL-based authentication


### ElastiCache for Solutions Architects

Patterns for ElastiCache

1. Lazy Loading: all the read data is cached, data can become stale in cache
2. Write Through: Adds or Update data in the cache when written to a DB (no stale data)
3. Session Store: store temp session data in cache (using TTL features)


## DynamoDB

DynamoDB is AWS solution for **Serverless** NoSQL datbase, it supports **document** and **key-value pair** data models

1. data is stored ion SSD Storage
2. High available with replication across **3** AZ (geographcally distinct data centers)
3. **Eventually Conststent Reads** (Default)
4. Strongly Consistent Reads

:::important

**Eventually Conststent Reads**

Consistency across all copies of data is usually reached within a second. Repeating a read after a short time should return the updated data.

This is for "Best Read Performance", this setting is enabled by default


**Strongly Consistent Reads**

A Strongly Consistent Read returns result that reflects all writes that received a successful response prior the read

:::


### DynamoDB - Basics

- DynamoDB is made of **tables**
- Each table has a **primary key** (must be decided at creation time)
- Each table can have an infinite number of items (= rows)
- Each item has **attributes** (can be added over time - can be null)
- Maximum size of a item is 400 KB


### DynamoDB - Provisioned Throuput

- Table must have provisioned read and write capacity units
- **Read Capacity Units (RCU)**: throuput for reads
  - 1 RCU: 1 strongly consistent read of 4 KB per second
  - 1 RCU: 2 eventually consistent read of 4 KB per second
- **Write Capacity Units (WCU)**: throughput for writes
  - 1 WCU: 1 write of 1 KB per second
- Option to setup auto-scaling of throughput to meet demand
- Throughput can be exceeded temporarily using "burst credit"
- If burst credit are empty, you'll get a `"ProvisionedThroughputException"`
- It's then advised to do an exponential back-off retry


### DynamoDB - DAX

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/dax_high_level.e4af7cc27485497eff5699cdf22a9502496cba38.png)

DAX is DynamoDB Accelerator, it provide **seamless cache** for DynamoDB, no appliation re-write needed. Writes gothrough DAX then to DynamoDB.

Multi-AZ is supported, 3 nodes minimum recommended for production



### DynamoDB Streams

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/DDB-Stream1.png)

- Changes in DynamoDB will end up in a DynamoDB Stream
- This stream can be read by AWS Lambda, so we can do analytical jobs
- Could implement cross region replication using Streams
- It has 24 hours of data retention


### DynamoDB - Security

- VPC Endpoints available to access DynamoDB without internet
- Access fully controlled by IAM
- Encryption: KMS and SSL/TLS

### DynamoDB - Other Features

Global Tables:

- Active Active replication in many regions
- Must enable DynamoDB Streams
- It is Low-latency, for Disaster Recovery

Capacity Planning:

- Planned capacity: provision WCU & RCU can enable auto scaling
- ON-demand capacity: get unlimited WCU & RCU, no throttle, more expensive

> rare workloads - on-demand capacity
> 
> predictable workloads which can be auto-scaled - planned capacity

other features like, backup & restore, migration and you can even setup a local DYnamoDB for development


## RedShift

This is the AWS solution to Data Warehousing service, it supports massively Parallel processing (MPP)

Backups for RedShift

- this is **enabled** by default and it has **1** day retention period, and maximum are 35 days
- always attempt to maintain **at least 3 copies** of your data, the original or the replicas on the compute node, the backups are on AWS S3

**But it is only available in one AZ**
