---
id: chapter03
title: EC2 Storage - EBS & EFS
sidebar_label: EBS & EFS
---

# EC2 Storage - EBS & EFS

## EBS Volume

**Elastic Block Store** (EBS) provides **persistent** block storage volumes for usage with Amazon EC2 instances in the AWS Cloud.

Each Amazon EBS volume is **automatically replicated** with its AZ to protect you from component failure, offering high availability and durability.


> EBS is like a virtual hard disk drive in the cloud
>
> - it uses the network to communicate the instance, which means there might be a bit of latency
> - it can be detached from an EC2 instance and attached to another one quickly, as long as in the same AZ


| Type                                           | Description                                                  | Use Cases                                | API Name | Volume Size  | Max. IOPS / Volume |
| ---------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- | -------- | ------------ | ------------------ |
| General Purpose (GP2 SSD)                      | General purpose that balances price and performance - can be used as boot volumes | Most work loads                          | gp2      | 1GB - 16TB   | 16000              |
| Provisioned IOPS (SSD)                         | Highest-performance SSD for mission-critical applications, IOPS (I/O Ops Per Sec) - can be used as boot volumes | Databases                                | io1      | 4GB - 16TB   | 64000              |
| Throughput Optimised Hard Disk Drive (ST1 HDD) | Low cost HDD for freq. accessed, throughput-intensive workloads | Big Data & Data warehouses               | st1      | 500GB - 16TB | 500                |
| Cold HDD (SC1 HDD)                             | Lowest cost HDD for less freq. accessed workloads            | File Servers                             | sc1      | 500GB - 16TB | 250                |
| EBS Magnetic                                   | Previous generation HDD                                      | Workloads where data is infreq. accessed | Standard | 1GB - 1TB    | 40 - 200           |



EBS is locked in an AZ, which means, if an EBS volume in `us-east-1a` cannot be attached to `us-east-1b` . To move a volume across, your first need to snapshot it



### Details of different EBS Volumes

#### gp2

GP2 is for `General purpose` that balances price and performance, this type of volume can be used as boot volumes

it:

- recommended for most workloads
- system boot volumes
- virtual desktops
- low-latency interactive apps
- development and test environments



here is some stats of GP2

- 1 GB - 16 TB
- small gp2 volimes can burst IOPS to 3000
- max IOPS is 16,000
- 3 IOPS per GB, means at 5334GB we are at the max IOPS



#### io1

io1 is suitable for critical business applications that require sustained IOPS performance, or more than 16,000 IOPS per volume (gp2 limit), it is also suitable for large database workloads



stats of io1

- 4 GB - 16 TB
- IOPS is provisioned (PIOPS) - min 100 ~ max 64,000
- the maximum ratio of provisioned IOPS to requested volume size (in GB) is 50:1



#### sc1

- Throughput-oriented storage for large volumes of data that is infrequently accessed
- scenarios where the lowest storage cost is important
- cannot be a boot volume



> Throughput refers to how much data can be transferred from one location to another in a given amount of time. It is used to measure the performance of [hard drives](https://techterms.com/definition/harddrive) and [RAM](https://techterms.com/definition/ram), as well as Internet and network connections.



stats of sc1

- 500 GB - 16 TB
- max IOPS is 250
- Max throughput of 250 MB/s - can burst



#### EBS Volume Type Summary

- gp2: Genenral Purpose volumes (cheap)
  - 3 IOPS / GB, minimum 100 IOPS, can burst to 3000 IOPS, with max 16,000 IOPS
- io1: Provisioned IOPS (expensive)
  - min 100 IOPS, max 64,000 IOPS (Nitro) or 32,000 (other)
- st1: Throughput Optimized HDD
  - 500 MB/s throughput
- sc1: Cold HDD, Infrequently  accessed data
  - 250 MB/s throughput



### EBS Snapshots

You need to make sure that the AZ of EC2 Instance is the same as the AZ of EBS Volume, otherwise this will cause a huge latency time.



:::note

What will happen if we terminate the EC2 Instance?

- EBS Volume got removed automatically (Root Device)
- other volume (by default) continue to persist, and the status of the volume is `available`
- we can create EBS and check "delete on termination"

:::



How to migrate data from AZ1 to another different AZ (EC2 / EBS)? Step by step:

1. Actions -> Create Snapshots
2. Turn the Snapshot to an AMI
3. Use the AMI to launch in another AZ



:::note

1. Find the root device volume, root device volume wil have the snapshotID, "Action" -> "Create Snapshot"
2. Select the snapshot, "Actions" -> "Create Images" then we can use it and deploy to another AZ
3. For "Virtualization Type", we have "Paravirtual" (PV) and Hardware Virtual Machine (HVM)

:::



:::tip

1. Volumes exist on EBS, think of EBS as *Virtual Hard Disk*
2. Snapshots are on S3, think of Snapshot as *photo of disk*
3. Snapshots are point in time copies of volumes
4. EBS Snapshots are **incremental**, only the blocks that have **changed** since your last snapshot are moved to S3
5. To create snapshot for AMazon EBS Volumes that serve as root devices, you should stop the instance **before** taking the snapshot
6. You can create AMIs from **Volumes** and **Snapshots**
7. You can change EBS Volume sizes on the fly, including changing the *size and storage type*
8. Volume will **ALWAYS** be in the same AZ as the EC2 Instance, BUT you can copy snapshots across AZ or Region
9. EBS Backup will utilize IO so you should not enable it while handling a lot of traffic
10. Recommend - detach the EBS volume to do backup, but not a must
11. EBS volumes retstored by snapshots need to be pre-warmed (using fio or dd command to read the entire volume)
12. snapshots can be automated using `"Amazon Data Lifecycle Manager"`

:::



### EBS Encryption





### EBS RAID





## EBS vs Instance Store





## EFS (Elastic File System)



