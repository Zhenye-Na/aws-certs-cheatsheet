---
id: chapter03
title: Elastic Compute Cloud
sidebar_label: EC2
---

## Elastic Compute Cloud (EC2)

Amazon Elastic Compute Cloud is a web service that provides resizable compute ccapacity in the cloud.

### EC2 Pricing Model / Type

1. On Demand: pay a fixed rate by the hour, no commitment
2. Reserved: provide a capacity reservation, minimum 1 year
   1. Standard Reserved Instance
   2. Convertible Reserved Instance
   3. Scheduled Reserved Instance
3. Spot: based on "bid", like stock, on demand
4. Dedicated Instances
5. Dedicated Hosts: Dedicated Hosts: physical EC2 Instance


:::tip

Question: How will this section be tested?

Answer: Scenario-based questions, will ask you what type of EC2 or services you will suggest.

:::

#### EC2 Instance Types - Main Ones

| Type              | Description                               |
|-------------------|-------------------------------------------|
| R                 | High RAM usage                            |
| C                 | High CPU usage                            |
| M                 | (Medium) balanced usage application       |
| I                 | High I/O                                  |
| G                 | High GPU usage                            |
| T2/T3 - burstable | burstable instance with a limit threshold |
| T2/T3 - unlimited | unlimited burstable amount                |


For Instance type "Spot", if this is terminated by Amazon EC2, you will note be charged for a partial hour of usage. However, if you terminate the instance yourself, you will be charged for *an hour* in which the instance ran.


Exam Tips:

1. Termination Protection is turned off by default, which mean by default, you cannot terminal an EC2 Instance.
2. On an EBS-backed Instance the default action is for the root EBS Volume to be deleted whe the instance is terminated
3. Default AMI cannot be encrypted, additional volume can be encrypted



### Security Groups

"Network & Security" -> "Security Groups"

> if you disable the HTTP 80 port, it will take effect *immediately*, the browser will time out

When you create a new inbound rule, you will also create a new outbound rule

1. Security Groups are **stateful**
2. Network Access Control is **stateless**

we will cover this in the future chapter


:::tip

- All *inbounds traffic is blocked* by default, all *outbound traffic is allowed*
- Changes to Security Groups take effect immediately
- You can have any number of EC2 instances with a Security Group
- Security Groups are stateful
- You cannot block network access in the security groups, instead we should use "Network Access Control Lists" (VPC Section)
- Allow Rule (OK), Deny Rules (X)

:::

**Added 2020-10-26:**

Security Group controls the inbound and outbound traffic of EC2

Security Group acts as the role like:

- "firewall" (connection-wise) on EC2 Instance
- Access to Ports
- IP Ranges
- Inbound/Outbound Network

**Security Group lives outside of EC2**

```
EC2 <-> Security Group <-> WWW
```

#### Referencing other Security Groups

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/sg-referencing.png)

> Since SG3 is not in the Inbound Rules of EC2 ①, so the EC2 with SG3 is not allowed to connect to EC2 ①


:::tip

Everytime there is a timeout problem, always check Security Groups first.

:::


### Migrations of EC2 Volume

I think it will be worthy to talk about ways to migrate EC2 Volume from Region / AZ to another different Refion / AZ. Here are the details to accomplish them.

**Region to Region**

- Take a snapshot of the EC2 Volume
- Create an AMI from the snapshot
- <u>Copy the AMI from one Region to another</u>
- Use the **copied AMI** to launch the new EC2 Instance in the new Region


**AZ to AZ**

- Take a snapshot of the EC2 Volume
- Create an AMI from the snapshot
- Use the AMI to launch the new EC2 Instance


### AMI Types

EBS vs Instance Store

1. Region
2. OS
3. Architecture
4. Launch Permissions
5. Storage for the root device (Root Device Volume)
   1. Instance Store (EPHEMERAL STORAGE) "RAM-like"
   2. EBS Backed Volumes


An **Instance Store** provides temporary block-level storage for your instance. Instance Store Volumes are sometimes called **Ephemeral Storage**. This storage is located on disks that are physically attached to the host computer. Instance store is ideal for **temporary** storage of information that changes frequently, such as buffers, caches, scratch data, and other temporary content, or for data that is replicated across a fleet of instances, such as a load-balanced pool of web servers.

> Instance store volumes cannot be stopped. If the underlying host fails, you will lose all your data.

An **"EBS-backed" Instance** is an EC2 instance which uses an EBS volume as it’s root device. EBS volumes are redundant, “virtual” drives, which are not tied to any particular hardware, however they are restricted to a particular EC2 availability zone. This means that an EBS volume can move from one piece of hardware to another within the same availability zone. You can think of EBS volumes as a kind of Network Attached Storage.

If the virtual machine’s hardware fails, the EBS volume can simply be moved to another virtual machine and re-launched. In theory, you won’t lose any data.

Another benefit is that EBS volumes can easily be backed up and duplicated. So you can take easy backup snapshots of your volumes, create new volumes and launch new EC2 instances based on those duplicate volumes.

> - EBS backed instances can be stopped. You won’t lose the data on this instance if it is stopped.
> - By default, both root volumes will be deleted on termination. However, with EBS volumes, you can tell AWS to keep the device volume.


### Encrypted Root Device Volumes & Snapshots

There are two different ways to encrypt root device volumes

1. Create EC2 Instance with Root Device VOlume encrypted at start
2. Encrypt the Root Device later
   1. "Action" -> "Create Snapshots"
   2. "Copy the snapshot", check "Encrypt this snapshot"
   3. Create image from this snapshot, launch EC2 Instance


All AMIs are categorized as either backed by Amazon EBSjor backed by instance store

**For EBS Volumes:** The root device for an instance launched from the AMI is an *Amazon EBS volume* created from an *Amazon EBS snapshot*. Think of EBS as a virtual hard disk


**For Instance Store Volumes:** The root device for an instance launched from the AMI is an *instance store* volume created from a template stored in *Amazon S3*. Think of snapshots as a photograph of the disk


:::tip

1. Snapshots of encrypted volumes are encrypted automatically
2. Volumes restored from encryted snapshots are encrypted automatically
3. You can share snapshots, but only if they are unencrypted
4. These snapshots can be shared with other AWS accounts or made public
5. You can now encrypt root device volumes upon creation of EC2 Instance

:::


### Identity Access Management Roles

Instance Settings -> Attach / Replace IAM Role

1. Roles are much more secure than storing access keys
2. Roles are easier to manage
3. Roles can be assigned to EC2 after creation for console / command line access
4. Roles are universal, easy to manage


### Elastic File System (EFS)

**Elastic File System** is a file storage service for EC2 instances. EFS is easy to use and provides a simple interface that allows you to create and configure file systems quickly and easily. With EFS,

- storage capacity is elastic
- growing and shrinking automatically as you add and remove files

so your applications have the storage they need, when they need it.

Once EC2 is created, we need to mount the EFS disks:

- TLS mount for encrypted option
  - `mount -t efs -o tls fs-xxxx:/ /target`
- It also supports network file system version 4 (NFSv4).
- We only pay for the storage you use (no pre-provisioning required).
- Can scale up to petabytes.
- Can support thousands of concurrent NFS connections.
- Data is stored across multiple AZ's within a Region.
- *Read After Write* Consistency. (No eventual consistency)


```
EC2 and EBS: 1 vs 1
EC2 and EFS: many vs 1
```

### EC2 Placement Groups

There are three different types of EC2 Placement Groups in AWS:

- Clustered Placement Group
- Spread Placement Group
- Partitioned Placement Group

The name of placement groups must be *unique* within your AWS account. Only certain types of instances can be launched in a placement group (compute optimized, GPU, memory optimized and storage optimized). We can't move existing instances into a placement group (they must be selected when are being created).

**Cluster Placement Group**

This group is a logical grouping of instances within a **single Availability Zone**. A cluster placement group can span peered VPCs in the **same Region**. Instances in the same cluster placement group enjoy a higher per-flow throughput limit of up to 10 Gbps for TCP/IP traffic and are placed in the same high-bisection bandwidth segment of the network.

The following image shows instances that are placed into a cluster placement group.

![](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/images/placement-group-cluster.png)

- low network latency
- high network throughput
- or both

Only certain instances can be launched in this mode.

**Spread Placement Group**

Launching instances in a spread placement group reduces the risk of simultaneous failures that might occur when instances share the same racks. Spread placement groups provide access to distinct racks, and are therefore suitable for mixing instance types or launching instances over time.

![](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/images/placement-group-spread.png)

**Partition Placement Group**

This group devides each group into logical segments called **partitions**. Amazon EC2 ensures that each partition within a placement group has its own set of racks. Each rack has its own network and power source. No two partitions within a placement group share the same racks, allowing you to isolate the impact of hardware failure within your application. Partition placement groups help **reduce the likelihood of correlated hardware failures** for your application.

No two partitions within a placement group share the same racks allowing you to isolate the impact of hardware failure within your application

![](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/images/placement-group-partition.png)


:::tip

1. A clustered placement group cannot span multiple AZs, while a spread placement and partitioned group can
2. The name you specify for a placement group must be unique within your AWS account
3. Only certain types of instances can be launched in a placement group, these types contain: Compute Optimized, GPU, Memory Optimized, Storage Optimized, etc..
4. AWS recommend homogeneous instances within clustered placement groups
5. You cannot merge placement groups
6. You cannot move an existing instance into a placement group. You can create an AMI from your existing instance, and then launch a new instance from the AMI into a placement group

:::

### Elastic Network Interfaces (ENI)

Logical component in a VPC that represents a **virtual network card**

The ENI can have the following attributes

- Primary provate IPv4, one or more secondary IPv4
- One Elastic IP (IPv4) per private IPv4
- One Public IP  ''''
- One or more Security Groups
- A MAC Address

You can create ENI independently and attach them on the fly (move them) on EC2 instances for failover


### Hibernate EC2

![](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/images/hibernation-flow.png)

| Hibernate EC2                     | Regular EC2                           |
|-----------------------------------|---------------------------------------|
| In-memory RAM is preserved        | stop: data on disk (EBS) kept in tact |
| Instance boot much faster         | terminate: EBS data, lost             |
| root EBS volume must be encrypted |                                       |

> Under the hood:
>
> RAM state is written to a file in the root EBS Volume

Hibernate EC2 is suitable for:

- long running processing
- services taken long time to initiate
- save RAM state


### Cross Account AMI Copy (FAQ + Exam Tip)

- You can share an AMI with aother AWS account
- Sharing an AMI does not affect the ownership of the AMI
- If you copy an AMI that has been shared with you account, you are the owner of the target AMI in your account
- To copy an AMI that was shared with you from another account, the owner of the source AMI must grant you read permissions for the storage that backs the AMI, either the associated EBS snapshot (for an Amaon EBS-backed AMI) or an associated S3 bucket (for an instance, store-backed AMI)


## Summary

- EBS Root Volumes of your DEFAULT AMI's cannot be encrypted. But you can use third-party tool to encrypt the root volume or this can be done when creating AMI's in the AWS console or using the API
- All Inbound traffic is blocked by default, all Outbound traffic is allowed
- Changes to Security Groups take effect immediately
- You can have any number of EC2 instances within a security group
- You can have multiple security groups attached to EC2 Instances
- Security Groups are STATEFUL
- If you create an inbound rule allowing traffic in, that traffic is automateically allowed back out again
- You cannot block specific IP addresses using Security Groups, instead use Network Access Control Lists
- You can specify allow rule but not deny rules
- Snapshots are point in time copies of Volumes
- Snapshots are incremental - this means that only the blocks that have changed since your last snapshot are moved to S3
- In order to create a snapshot for Amazon EBS volumes that serve as root devices, you should stop the instance before taking the snapshot, you can take a snapshot while teh instance is running
- You can create AMI's from both Volumes and Snapshots
- You can change EBS Volume sizes on the fly, including changing the size and storage type
- Volumes will ALWAYS be in the same AZ as the EC2 Instance
- Snapshots of encrypted volumes and volumes restored from encrypted snapshots are encrypted automatically
- You can share un-encrypted snapshots, these snapshots can be shared with other AWS accounts or made public
- Instance Store Volumes are sometimes called Ephemeral Storage
- Instance Store Volumes cannot be stopped. If the underlying host fails, you will LOSE your data.
- EBS backed instances can be stopped. You will NOT LOSE teh data on this instance if it is stopped
- You can reboot both, you will not lose data
- By default, both ROOT volumes will be deleted on termination. However, with EBS volumes, you can tell AWS to keep the root device volume

To encrypt an un-encrypted root device volume:

- create a snapshot of the un-encrypted root device volume
- create a copy of the snapshot and select teh encrypt opinion
- create an AMI from teh encrypted snapshot
- use that AMI to launch new encrypted instances

