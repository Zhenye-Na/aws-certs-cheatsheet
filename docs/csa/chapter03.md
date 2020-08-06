---
id: chapter03
title: Database on AWS
sidebar_label: AWS Database
---

# Chapter 3 - Database on AWS

## 1. RDS Overview

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


## 2. RDS - Backups, Multi-AZ & Read Replicas

### 2.1 Backups

There are two types of Backups for RDS

1. Automated Backups
2. Database Snapshots

### 2.1.1 Automated Backups

It allows user to receover your database to any point in time within a  "Retention Period", this is around 1 ~ 35 days.

Automated backup is enabled by default, the backup data is stored in S3, meanwhile, the size of your RDS is equal to the size of S3


### 2.1.2 Database Snapshot

Database Snapshot are stored even after you delete the original RDS Instance

## 2.2 Encryptions

This is achieved by using AWS KMS (Key Management Service), once the ecryption is on, the followings are encrypted:

- data underlying storage
- automated backups
- read replicas
- database snapshots

:::tip

Whenever you restore either an Automated Backup or Database Snapshot, the restored version of the database will be a **new** RDS instance with a **new** DNS endpoint

:::


### 2.2 Multi-AZ

- This is an exact copy of your production databse in another AZ
- Automactically synchronized when your prod database is written to
- In the event of the following:
  - planned database maintenance
  - DB instance failure
  - AZ failure

This is only for **Disaster Recovery**


### 2.3 Read Replicas

This allows you to have a read-only copy of your production database.

This is achieved by using assynchronously replication from the primary RDS Insntace to the Read Replicas. It is better for those database with heavy read workloads


:::tip

Be careful for the difference between Read Replicas and the previous database backup methods

1. Read Replica is for scaling, for performance improvements
2. In order touse Read Replicas, you should turn on the setting for "Automated Backups"
3. You can have up to 5 Read replicas of any database
4. You can even have Read replicas of Read replicas
5. Each Read replicas has its own Endpoint
6. Read replicas can be prompted to be their own database, but replications wont work

:::



### 2.4 DynamoDB

DynamoDB is AWS solution for NoSQL datbase, it supports **document** and **key-value pair** data models

1. data is stored ion SSD Storage
2. data spreads across 3 geographcally distinct data centers
3. Eventually Conststent Reads (Default)
4. Strongly Consistent Reads

:::important

**Eventually Conststent Reads**

Consistency across all copies of data is usually reached within a second. Repeating a read after a short time should return the updated data.

This is for "Best Read Performance", this setting is enabled by default


**Strongly Consistent Reads**

A Strongly Consistent Read returns result that reflects all writes that received a successful response prior the read

:::



### 2.5 RedShift

This is the AWS solution to Data Warehousing service, it supports massively Parallel processing (MPP)

Backups for RedShift

- this is enabled by default and it has 1 day retention period, and maximum are 35 days
- always attempt to maintain **at least 3 copies** of your data, the original or the replicas on the compute node, the backups are on AWS S3

But it is only available in one AZ


### 2.6 Aurora

Aurora is the MySQL compatible, AWS solution to Relational Database

Aurora always maintains 2 copies of your data in each AZ, with a minimum of 3 AZ => which leads to **6 copies** of your data

There are 2 types of Aurora Replicas

1. Aurora Replicas
2. MySQL Read Replicas

Backups for Aurora, also 2 types:

1. Automated Backups
2. Data Snapshots

In order to migrate data from MySQL to Aurora, you can do the following things

- take a data snapshot and restore in Aurora
- create an Aurora Read replica and then promote the Read Replica as a "database service"

There are 2 types of read replicas:

1. Aurora Replicas
2. MySQL Replicas

Automated failover is only available with Aurora Replics


### 2.7 ElasticCache
This is the AWS solution to web-service-based in-memory cache

ElasticCache supports Memached and Redis, it helps improve performance

- If you need scale horizontally, you need choose Memcached
- If you need Multi-AZ, Backups and Restores, you need choose Redis


:::tip

Right now, we have two methods of improving performance

1. ElasticCache -> Cache layer to speed up
2. Read Replicas -> Improved read/write on database layer

:::


## 3. Summary

TBD





