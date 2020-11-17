---
id: chapter01
title: IAM
sidebar_label: IAM
---

## Identity Access Management (IAM)

- IAM (Identity Access Management) allows you to manage users, groups, permmisions (level of access) to the AWS console
- S3 (Simple Storage Service) provides files storage service

IAM has a **global** view, not like EC2 or S3 has a **Region**


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
