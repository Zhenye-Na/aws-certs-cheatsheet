---
id: chapter02
title: S3
sidebar_label: S3
---

## Simple Storage Service (S3)

- S3 is **object-based**, it allows to upload files from 0 ~ 5 TB
- Files are stored in *Buckets*

### Basics of S3

1. S3 is a **universal namespace**, which means the names should be **unique globally**.
   1. for example, `https://s3 ........ amazonaws.com/<bucket_name>`, this `<bucket_name>` should be unique
2. Once uploading successfully, it will return HTTP Status Code `200`

### What are objects in S3?

For `object` in S3, it has the several features.

1. **Key**. this is the FULL path
   1. eg. `<bucket_url>/somePath/someFolder/filename`, here `somePath/someFolder/filename` is the Key, not just the `filename`
   2. there are no concept of `"directories"` in S3. the key can contain slashes `/`
2. **Value**. content of the body
   1. max-size is 5TB, if uploading greater than 5GB, then you can use "multi-part uploading"
3. **VersionID**. version control if enabled
4. **MetaData**. list of text key / value pairs - system or user data
5. **Tags**. Unicode key / value pairs (10 most), uesful for security or lifecycle
6. **Subresources**:
   1. Access Control List
   2. Torrent

### Consistency Model in S3

#### Read After Write

If you write a new file and read it immediately afterwards, you will be able to view that file

#### Eventually Consistent

If you update **AN EXISTING** file or **DELETE** a file, then read it immediately, you may get the older version or you may not. But if you wait for a minute, you will get the latest version.

> Basically, changes to object can take a little bit of time to propogate.

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


### S3 Security

- User based
  - IAM policies - which API calls should be allowed for a specific user from IAM console
- Resource based
  - Bucket policies - bucket wide rules from the S3 console - allows cross account
  - Object Access Control List - Finer Grain
  - Bucket Access Control List - Less Common


#### S3 Bucket Policies

JSON based policies

- Resources: buckets and objects
- Actions: set of API to allow or deny
- Effect: allow or deny
- Principal: the account or user to apply the policy to

S3 bucket for policy to

- grant public access to the bucket
- force objects to be encrypted at upload
- grant access to another account (Cross-Account)


#### S3 Security - Other

**Networking**

Supports VPC Endpoints (for instances, in VPC without `www` internet)

**Logging an Audit**

- S3 access logs can be stored in other S3 bucket
- API calls can be logged in AWS CloudTrail

**User Security**

- MFA
- Signed Urls: URLs that are valid only for a limited time (eg: premium video service for logged in users)



### S3 Encryption

All of the new files that are uploaded to S3 buckets are **PRIVATE**

There are three encryption methods:

1. Encryption In Transit
   1. SSL / TLS
2. Encryption At Rest
   1. S3 Managed Keys : `SSE-S3`
   2. AWS Key Management Service, Managed keys : `SSE-KMS`
   3. Server-side Encryption with Customer Provided keys : `SSE-C`
3. Client Side Encryption, like gpg, etc.

![](https://blog.architecting.it/wp-content/uploads/2016/03/CloudianPost3Images3.jpg)

#### SSE-S3

The encryption using keys handled & managed by AWS S3, the files are encrypted at server-side.

SSE-S3 use AES-256 as encryption type, also `"x-amz-server-side-encryption":"AES256"` must be set in the request header

This diagram shows the three-step **encryption** process when using SSE-S3:

![](https://static.packt-cdn.com/products/9781789534474/graphics/assets/e596c805-e80a-4a6e-9ca8-cb60497754a1.png)

:::note

1. The client selects their object(s) to upload to S3 and indicates the encryption mechanism of SSE-S3 during this process.
2. S3 then takes control of the object and encrypts it with a plaintext data key generated by S3. The result is an encrypted version of the object, which is then stored in your chosen S3 bucket.
3. The plaintext data key that is used to encrypt the object is then encrypted with an S3 master key, resulting in an encrypted version of the key. This now-encrypted key is also stored in S3 and is associated with the encrypted data object. Finally, the plaintext data key is removed from memory in S3.

:::


This diagram shows the four-step **decryption** process when using SSE-S3:

![](https://static.packt-cdn.com/products/9781789534474/graphics/assets/7c2f439c-1d5c-4fe0-a397-e65938beec22.png)


#### SSE-KMS

![](https://www.oreilly.com/library/view/aws-certified-solutions/9781789130669/assets/0faf29ee-4a0b-4a29-99f5-c4e1ec042047.png)

The encryption using keys handled & managed by AWS KMS, the files are encrypted at server-side.

`"x-amz-server-side-encryption":"aws:kms"`

advantages:

- user control
- audit trail

#### SSE-C

![](https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2017/11/15/s3_encryption_diagram_cl_a1.png)

- Server side encryption using data keys full managed by the customer outside of AWS
- S3 does not store encryption key
- HTTPS must be used

#### Encryption In Transit

AWS S3 exposes:

- HTTP endpoint: non-encrypted
- HTTPS endpoint: encryption in flight (recommended)

HTTPS is mandatory for SSE-C


### S3 Versioning

S3 also supports version control, it is enabled at `bucket` level

1. Stores all versions of an object, inclusding all writes and even if you delete a object. For delete operation, it is a `delete` marker. but you can see the file when the `version` is toggled on (reason see below)
2. Backup tool
3. Once enabled, cannot be disenabled, but you can `suspend`
4. Integrates with **Lifecycle** rules
5. Support MFA

> any file that is not versioned prior to enabling versioning will have version `"null"`

:::note

Suppose the v1 version of your file is 100 KB, and you edited it to 200 KB. You upload the file again to S3. Then this file will be version 2, but the size will **300 KB**, since the size of file is accumulated

:::

#### Delete Marker

> https://docs.aws.amazon.com/AmazonS3/latest/dev/DeleteMarker.html

AWS create Delete Marker, it does so whenever you send a `DELETE` Object request on an object in a *versioning-enabled or suspended bucket*. The object named in the `DELETE` request is **not** actually deleted. Instead, the <u>delete marker becomes the current version of the object</u>. (The object's key name (or key) becomes the key of the delete marker.)

If you try to get an object and its current version is a delete marker, Amazon S3 responds with:

- A `404` (Object not found) error
- A response header, x-amz-delete-marker: true

The response header tells you that the object accessed was a delete marker. This response header never returns `false`; if the value is `false`, Amazon S3 does not include this response header in the response.

The following figure shows how a simple `GET` on an object, whose current version is a **delete marker**, returns a `404 No Object Found error`.

![](https://docs.aws.amazon.com/AmazonS3/latest/dev/images/versioning_DELETE_NoObjectFound.png)

The only way to list delete markers (and other versions of an object) is by using the **versions subresource** in a `GET` Bucket versions request. A simple `GET` does not retrieve delete marker objects. The following figure shows that a `GET` Bucket request does not return objects whose current version is a delete marker.

![](https://docs.aws.amazon.com/AmazonS3/latest/dev/images/versioning_GETBucketwithDeleteMarkers.png)


### S3 CORS

If you request data from another S3 bucket, you need to enable CORS

**Cross Origin Resource Sharing (CORS)** allows you to limit the number of websites that can request your files in S3 and limit your costs

![](https://docs.amazonaws.cn/en_us/sdk-for-javascript/v2/developer-guide/images/cors-overview.png)

### Lifecycle Management with S3

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


| Type                   | Description                                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| File Gateway (NFS)     | Files are stored as objects in your S3 buckets, accessed throught a NFS mount point.                                                                                   |
| Volume Gateway (iSCSI) | Same using virtual directories via iSCSI block protocol. Files are stored in the cloud as Amazon EBS snapshots. Two types: (1) Stored volumnes and (2) Cached volumes. |
| Type Gateway (VTL)     | It offers durable, cost-effective solution to archive your data in the AWS Cloud (same mecanism as Volume Gateway).                                                    |
