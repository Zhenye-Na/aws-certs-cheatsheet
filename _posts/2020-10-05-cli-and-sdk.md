---
title: AWS CLI, SDK IAM Roles & Policies
date: 2020-10-05
categories: [AWS-SAA, CLI and SDK]
tags: [CLI, SDK]
---


## AWS CLI

## EC2 Instance Metadata

It allows AWS EC2 instances to "learn about themselves" **without using an IAM Role for that purpose**

```sh
curl http://169.254.169.254/latest/meta-data/
```

you can retrieve the IAM Role name from the metadatam but you cannot retrive the IAM Policy

> Metadata = Info about the EC2 Instance

