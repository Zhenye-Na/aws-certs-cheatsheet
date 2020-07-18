---
id: chapter06
title: HA Architecture
sidebar_label: HA Architecture
---

# HA Architecture

HA (High- Availability) is a plan for failure, you should prepare for

1. Everything will fail
2. You should always plan for failure



:::tip

1. It is designed for failure
2. you can use Multi-AZ and Multi-Regions
3. RDS supports
   1. Multi-AZ : this is for Disaster Recovery
   2. Read Replicas: this is for Improving performance
4. Scaling Out and Scaling Up
   1. Scaling out: more EC2 Instance
   2. Scaling UP: upgrading with more resources (RAM, CPU, etc..)
5. Considering "cost" as a factor
6. different S3 storage class

:::


## Elastic Beanstalk

Deploy application to AWS without actually knowing AWS

Elastic Beanstalk automatically handles the details of capacity provisioning load balancing, scaling and application health monitoring

