---
title: Intro to AWS Certified Solutions Architect - Associate
date: 2020-05-28
categories: [AWS-SAA, Intro]
tags: [Intro]
---


## Exam Blue Print

- 130 min, 60 Questions, Multiple choice
- Results are between 100 ~ 1000, passing score 720. greater than 70%
- Qualification is valid for 2 years
- Scenario-based questions


## Global Infrastructure

### Availability Zone & Region


There are 19 Regions and 57 Availability Zones in Dec. 2018,
There are 24 Regions and 72 Availability Zones in 2019

^^ will not be tested

Think "Availability Zone" as a "Data Center"


#### Availability Zone

An Availability Zone may be several Data Centers. If they (Data Centers) are close to each other, they may be counted as one Availability Zone.

> I will use AZ referring to "Availability Zone" for short in these notes.
>
> **Availability Zone -> one or more Data Centers**

#### Region

A region is a geographical area. Each Region consists of *2 or more* Availability Zone.

#### Edge Locations

Edge Locations are endpoints for AWS which are used for **caching content**. Typically, this consists of CloudFront, Amazon's Content Delivery Network.


\# of Edge Locations > \# of Availability Zones



For example:

A user is in Sydney and the server he wanna reach is in NYC. The user wanna download some large files from the server. After the user downloads the file, the file is cached inside the Sydney Edge Location, and then if someone else from Sydney also tries to access that file, he won't need to download from NYC since the file is cached in Sydney's Edge Location.

![region-az-edgelocation](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/region-az-edgelocation.png)

## Exam Tips

1. A **Region** is a physical location in the world, which consists of **two or more** Availability Zones.
2. An **Availability Zone** is **one or more** discrete Data Centers, each with redundant power, networking, and connectivity, housed in a separate facility.
3. **Edge Locations** are the endpoints for AWS which are used for **caching content**. Typically, this consists of CloudFront, Amazon's Content Delivery Network.
