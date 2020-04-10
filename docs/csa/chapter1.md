---
id: chapter1
title: IAM and S3
sidebar_label: IAM and S3
---

- IAM (Identity Access Management) allows you to manage users, groups, permmisions (level of access) to the AWS console
- S3 (Simple Storage Service) provides files storage service

## Identity Access Management (IAM)

### IAM Features

IAM offers the following features:

1. Centralized control of your AWS account
2. Shared Access to your AWS account
3. Granular Permissions
4. Identity Fedration (Active Directory, Github ...)
5. Multi-Factor Authentication
6. Provide temporary access for users / devices and services where necessary 
7. Allows you to set up your own password rotation policy
8. integrates with many different AWS services
9. Support PCI DSS Compliance

### Terminology of IAM

Next, let's get familiar with some terminology of IAM:

- Users, Groups, Roles (I think these are naive so I just list them here)
- Policies, this is a JSON formatted file, call **Policy Document**


## Simple Storage Service (S3)

- S3 is **object-based**, it allows to upload files from 0 ~ 5 TB
- Files are stored in *Buckets*

### Basics of S3

1. S3 is a **universal namespace**, which means the names should be unique globally.
   1. for example, `hhttps://s3 ........ amazonaws.com/<bucket_name>`, this `<bucket_name>` should be unique
2. Once uploading successfully, it will return HTTP Status Code `200`

### What are objects in S3?

For `object` in S3, it has the several features.

1. **Key**. this is the name of the object.
2. **Value**. simply the data and it's made up of a sequence of bytes
3. **VersionID**. this field is for version control
4. **MetaData**
5. **Subresources**:
   1. Access Control List
   2. Torrent

### Consistency Model in S3

#### Read After Write

If you write a new file and read it immediately afterwards, you will be able to view that file

#### Eventually Consistent

If you update **AN EXISTING** file or **DELETE** a file, then read it immediately, you may get the older version or you may not. But if you wait for a minute, you will get the latest version.

Basically, changes to object can take a little bit of time to propogate.

### S3 Features

1. **Tiered Storage Available**
2. Lifecycle Management
3. Versioning
4. Encryption
5. MFA Delete
6. Secure your data using
   1. Access Control List
   2. Bucket Policy


### S3 Storage Classes

There are several classes for S3 storage

| Storage Tiers                                  | Description                                                                                                                        |
|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| S3 Standard                                    | This tier provides `99.99%` availability and `99.999999999%` durability (there are 11 `9`s LOL)                                    |
| S3 - IA (Infrequently Accessed)                | Data that is accessed less frequently, but requires rapid access.  Lower fee than S3 - Standard. but it charge for a retrieval fee |
| S3 One Zone - IA   (Reduce Redundancy Storage) | This does not require multiple availability zone data resilience                                                                   |
| S3 - Intelligent Tiering                       | This tier utilizes Machine Learning                                                                                                |
| S3 - Glacier                                   | For data archive                                                                                                                   |
| S3 - Glacier Deep Archive                      | Slowest, cheapest. File retrieval time ~ 12 hours                                                                                  |

### S3 Security and Encryption

All of the new files that are uploaded to S3 buckets are **PRIVATE**

There are three encryption methods:

1. Encryption In Transit
   1. SSL /TLS
2. Encryption At Rest
   1. S3 Managed Keys : `SSe-S3`
   2. AWS Key Management Service, Managed keys : `SSE-KMS`
   3. Server-side Encryption with Customer Provided keys : `SSE-C`
3. Client Side Encryption, like gpg, etc.


### S3 Versioning

S3 also supports version control.

1. Stores all versions of an object, inclusding all writes and even if you delete a object. For delete operation, it is a `delete` marker.
2. Backup tool
3. Once enabled, cannot be disenabled, but you can `suspend`
4. Integrates with **Lifecycle** rules
5. Support MFA

> Suppose the v1 version of your file is 100 KB, and you edited it to 200 KB. You upload the file again to S3. Then this file will be version 2, but the size will **300 KB**, since the size of file is accumulated

#### Lifecycle Management with S3

S3 uses lifecycle rules to manage objects

1. Automates moving your objects between different storage tiers
2. It can be used in conjection with versioning
3. It can be applied to current versions and previous versions


### Cross Region Replication in S3

Cross Region Replication in S3 requires **enabling versioning**

Keypoints of Cross Region Replication:

- if you put delete marker in original bucket, it will not replicate the delte marker in CRR Bucket
- the files already in the source bucket will not be replicated automatically


:::tip

1. Versioning should be enabled both in source and destination bucket
2. Regions must be unique (LOL)
3. Files in an existing bucket are not replicated automatically
4. Delete markers are not replicated
5. Delete individual versions / delete markers will not be replicated

:::


### S3 Transfer Acceleration

This utilizes the **CloudFront Edge Networks** to accelerate your uploads to S3. Instead of uploading directly to your S3 bucket, you can use a distinct url to *upload directly to an Edge Location*, which will *then transfer to S3* using Amazon Backbone Network


#### Amazon CloudFront

CloudFront is a Contetnt Delievery Network (CDN), which is:

a system of **distributed** servers / network that deliever webpages and other web content to a **user based on the geographic locations** of the user, origin of the webpage and a CDN.

##### Key Terminology of CloudFront

**Edge Location**

This is the location where content will be cached, and separate to the AWS Region / AZ.

**Origin**

This is the origin of  all the files that the CDN will distribute. This can be an

1. S3 Bucket
2. EC2 Instance
3. Elastic Load Balancer
4. Route53


**Distribution**

This is the name given the CDN which consists of *a collection of Edge Locations*

There are two types of Distribution

1. Web Distribution: for website
2. RTMP: for Media Streaming


:::tip

1. Edge Location are not just READ only - you can also write to it, since files are cached here
2. Objects are cached for the life of the TTL (Time To Live)
3. You can *clear cached objects* (Invalidate the cache), but you will be charged
4. CloudFront also supports "Restrict Viewer Access", like contents can only be viewed by "paid" users. using "Signed Urls"
:::


### Snowball and Storage Gateway

Briefly speaking:

1. Snowball is an equipment, moving large amounts of data into the AWS Cloud. It supports:
   1. Import to S3
   2. Export to S3
2. Storage Gateway is a service enabling you to securely store data to the AWS Cloud for scalable and cost-effective storage

#### Storage Gateway

Basically there are three types of Storage Gateway:

1. File Gateway
2. Volume Gateway
   1. Stored Volumes
   2. Cached Volumes
3. Tape Gateway Virtual Tape Library (VTL)

**File Gateway**

Files are stored as objects in your S3 Buckets, accessed through a Network File System (NFS) mounting point

**Volume Gateway**

1. The Volume Gateway presents your application with disk volumes using the iSCSI block protocol
2. Asychronously back up as point-in-time snapshots, the snapshots are stored in the cloud as Amazon EBS Snapshots
3. Snapshots are incremental backups that capture only changed blocks, but compressed to minimized charges

=> Storing Virtual Hard Disk Drive in the Cloud

Let's summarize the differences between **Stored Volumes** and **Cached Volumes**

For **Stored Volumes**:

1. Entire Dataset stored on site
2. Asynchronously backed up to S3

For **Cached Volumes**:

1. Entire Dataset is stored on S3
2. Most Frequently Accessed data are cached on site
