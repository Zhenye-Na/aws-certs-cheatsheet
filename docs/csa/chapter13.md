---
id: chapter13
title: AWS Security and Encryption
sidebar_label: Security and Encryption
---

> KMS, Encryption SDK, SSM Parameter Store

:::info

**Why encryption?**

1. Encryption in flight (SSL)

Because:

- Data is encrypted before sending and decrypted after receiving
- SSL certificates help with encryption
- Encryption in flight ensures no MITM (man in the middle attack) can happen

2. Server-side Encryption at rest

Because:

- Data in encrypted after being received by the server
- Data is decrypted before being sent
- It is stored in an encrypted form
The encryption / decryption keys must be managed somewhere and the server must have access to it

3. Client-side encryption

- Data is encrypted by the client and never decrypted by the server (gpg)
- Data will be decrypted by a receiving client
- The server should not be able to decrypt the data
- Could leverage Envelope Encryption

:::


## AWS KMS (Key Management Service)

AWS KMS provides an easy way to control access to your data, AWS manages keys for you. It is also fully integrated with IAM for authorization

It seamlessly integrated into:

- EBS: encrypt volums
- S3: server-side encryption of objects
- RedShift / RDS: encrypt data
- SSM: Parameter store

> Anytime you need to share sensitive information, use KMS

The value in KMS is that the CMK used to encrypt data can never be retrieved by the user; and the CMK can be rotated for extra security

> CMK - Customer Master Keys

:::important

1. Never ever store you secrets in plaintext, especially in your code
2. KMS can only help in encrypting up to 4KB of data per call, if data is greater than 4KB, use Envelope Encryption

:::

To give access to KMS to someone:

- make sure the Key Policy allows the user
- make sure the IAM Policy allows the API Calls


### AWS Functionality

- Able to fully manage the keys & policies, Create, Rotation policies, Disable, Enable
- Able to audit key usage (with CloudTrail)
- Three types of Customer Master Keys (CMK):
  - AWS Managed Service Default CMK - free
  - User Keys created in KMS - $1 / month
  - User keys imported (must be 256-bit symmetric key) - $1 / month
- Additional pay for API Calls to KMS ($0.03 / 10000 calls)


### KMS API - Encrypt and Decrypt

All the encryption and decryption happen inside of KMS, and it will check for the IAM permissions

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/encryption-decryption-kms.png)


### Encryption in AWS Services

#### Requires migration (Snapshot + Backup)

- EBS Volumes
- RDS Databases
- ElastiCache
- EFS network file system

#### In-place encryption

- S3

