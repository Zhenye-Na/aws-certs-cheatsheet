---
id: chapter2
title: Elastic Compute Cloud
sidebar_label: EC2
---

## Elastic Compute Cloud (EC2)

Amazon Elastic Compute Cloud is a web service that provides resizable compute ccapacity in the cloud.

### EC2 Pricing Model

1. On Demand: pay a fixed rate by the hour, no commitment
2. Reserved: provide a capacity reservation
   1. Standard Reserved Instance
   2. Convertible Reserved Instance
   3. Scheduled Reserved Instance
3. Spot: based on "bid", like stock, on demand
4. Dedicated Hosts: Dedicated Hosts: physical EC2 Instance


:::tip

Question: How will this section be tested?

Answer: Scenario-based questions, will ask you what type of EC2 or services you will suggest.

:::


For Instance type "Spot", if this is terminated by Amazon EC2, you will note be charged for a partial hour of usage. Howeverm if you terminate the instance yourself, you will be charged for *an hour* in which the instance ran.


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

- All inbounds traffic is blocked by default, all outbound traffic is allowed
- Changes to Security Groups take effect immediately
- You can have any number of EC2 instances with a Security Group
- Security Groups are stateful
- You cannot block network access in the security groups, instead we should use "Network Access Control Lists" (VPC Section)
- Allow Rule (OK), Deny Rules (X)

:::


### EBS Volume

Elastic Block Store (EBS) provides persistent block storage volumes for usage with Amazon EC2 instances in the AWS Cloud.

Each Amazon EBS volume is **automatically replicated** with its AZ to protect you from component failure, offering high availability and durability.


> EBS is like a virtual hard disk drive in the cloud


| Type                                 | Description                                                     | Use Cases                                | API Name | Volume Size  | Max. IOPS / Volume |
|--------------------------------------|-----------------------------------------------------------------|------------------------------------------|----------|--------------|--------------------|
| General Purpose (SSD)                | General purpose that balances price and performance             | Most work loads                          | gp2      | 1GB - 16TB   | 16000              |
| Provisioned IOPS (SSD)               | Highest-performance SSD for mission-critical applications       | Databases                                | io1      | 4GB - 16TB   | 64000              |
| Throughput Optimised Hard Disk Drive | Low cost HDD for freq. accessed, throughput-intensive workloads | Big Data & Data warehouses               | st1      | 500GB - 16TB | 500                |
| Cold HDD                             | Lowest cost HDD for less freq. accessed workloads               | File Servers                             | sc1      | 500GB - 16TB | 250                |
| EBS Magnetic                         | Previous generation HDD                                         | Workloads where data is infreq. accessed | Standard | 1GB - 1TB    | 40 - 200           |


### EBS Volumes and Snapshots

You need to make sure that the AZ of EC2 Instance is the same as the AZ of EBS Volume, otherwise this will cause a huge latency time.

:::info

What will happen if we terminate the EC2 Instance?

- EBS Volume got removed automatically (Root Device)
- other volume (by default) continue to persist, and the status of the volume is `available`
- we can create EBS and check "delete on termination"

:::


How to migrate data form AZ1 to another different AZ (EC2 / EBS)? Step by step:

1. Actions -> Create Snapshots
2. Turn the Snapshot to an AMI
3. Use the AMI to launch in another AZ


:::info

1. Find the root device volume, root device volume wil have the snapshotID, "Action" -> "Create Snapshot"
2. Select the snapshot, "Actions" -> "Create Images" then we can use it and deploy to another AZ
3. For "Virtualization Type", we have "Paravirtual" (PV) and Hardware Virtual Machine (HVM)

:::


:::tip

1. Volumes exist on EBS, think of EBS as *Virtual Hard Disk*
2. Snapshots are on S3, think of Snapshot as *photo of disk*
3. Snapshots are point in time copies of volumes
4. Snapshots are **incremental**, only the blocks that have **changed** since your last snapshot are moved to S3
5. To create snapshot for AMazon EBS Volumes that serve as root devices, you should stop the instance **before** taking the snapshot
6. You can create AMIs from **Volumes** and **Snapshots**
7. You can change EBS Volume sizes on the fly, including changing the *size and storage type*
8. Volume will **ALWAYS** be in the same AZ as the EC2 Instance

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


:::tip

1. Snapshots of encrypted volumes are encrypted automatically
2. Volumes restored from encryted snapshots are encrypted automatically
3. You can share snapshots, but only if they are unencrypted
4. These snapshots can be shared with other AWS accounts or made public
5. You can now encrypt root device volumes upon creation of EC2 Instance

:::


### CloudWatch vs CloudTrail

#### CloudWatch

**AWS CloudWatch** is a monitoring service to monitor your AWS resources, as well as the applications that you run on AWS. Metrics like CPU, network, disk, status check.


- CloudWatch is about monitoring performance.
- CloudWatch with EC2 will monitor events every 5 minutes by default.
- You can have 1 minute intervals by turning on detailed monitoring.
- You can create CloudWatch alams which trigger notifications.
- What can CloudWatch do?
  - **Dashboards**: Creates awesome dashboards to see what is happening with your AWS environment.
  - **Alarms**: Allows you to set Alarms that notify you when particular thresholds are hit.
  - **Events**: Helps you to responde to state changes in your AWS resources.
  - **Logs**: Aggregates log data.


CloudWatch can monitor:

1. Compute Resources: EC2 Instances, Autoascaling Group, Elastic Load Balancers, Route53 Health Check
2. Storage & Content Delievery: EBS Volumes, Storage Gateways, CloudFront


#### CloudTrail

**AWS CloudTrail** increases visibility into your user and resource activity by <u>recording AWS Management Console actions and API calls</u>. You can identify which users and accounts called AWS, the source IP address from which the calls were made, and when the calls occurred.


:::tip

1. CloudWatch is used for monitoring performance
2. CloudWatch can monitor most of AWS as well as your applications that run on AWS
3. CloudWatch with EC2 will monitor events every 5 minutes by default
4. But you can have 1 minute interval by turning on detailed monitoring
5. You can create CloudWatch alarms which trigger notifications
6. CloudWatch is all about **Performance**, CloudTrail is all about **Auditing**

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

