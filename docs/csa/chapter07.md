---
id: chapter07
title: Virtual Private Cloud
sidebar_label: VPC
---

# Virtual Private Cloud (VPC) ★★★

![Virtual Private Cloud](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/vpc-diagram.png)

> [Amazon Virtual Private Cloud Documentation](https://docs.aws.amazon.com/vpc/index.html)

VPC lets us provision a **logically isolated** section of our infrastructure where we can launch AWS resources in a virtual network that we define. We have complete control over:

- our virtual networking environment, including selection of our own IP address range, creation of subnets
- configuration of route tables
- network gateways

Additionally, we can create a hardware VPN connection between our corporate datacenter and our VPC and leverage the AWS cloud as an extension of our corporative datacenter by default 


## CIDR, Private vs Public IPv4

### CIDR - IPv4 (Classless Inter-Domain Routing)

CIDR are used for Security Groups rules or AWS networking in general. They help to define an IP address range

- `192.168.100.0/32` -> one IP
- `0.0.0.0/0` -> all IPs
- we can also do something like `192.168.0.0/26`, which means there are 64 IPs (`192.168.0.0 - 192.168.0.63`)

A CIDR has two compoments:

1. the base IP (`xx.xx.x.x`): it repesents an IP contained in the range
2. the subnet mask (`/32`): defines how many bits can change in the IP

:::info

The subnet ask can take two forms

1. `255.255.255.0`
2. `/24`

:::

example:

`/24` allows `2 ^ (32 - 24) = 2 ^ 8` IPs from the base IP

:::note

Quick memo:

- /32: no IP can change
- /24: last IP number can change
- /16: last two IP number can change
- /8: last three IP number can change
- /0: all IPs

:::

### Private vs Public IPv4

- The Internet Assigned Numbers Authority (IANA) established certain blocks of IPv4 addresses for the use of private (LAN) abd public (Internet) addresses
- Private IP can only allow certain values
  - 10.0.0.0 - 10.255.255.255 (10.0.0.0/8) <- in big networks
  - 172.16.0.0 - 172.31.255.255 (172.16.0.0/16) <- *AWS* 
  - 192.168.0.0 - 192.168.255.255 (192.168.0.0/16) <- home networks

All the rest of the IP on the internet are public IP


## Default VPC Overview

- All new accounts have a default VPC
- New instances are launched into default VPC if no subnet is specified
- Default VPC have internet connectivity and all instances have public IP (so that we can use the instance to do like `yum update` ..)
- We also get a public and private DNS name

For Default VPC

- user friendly, allowing you to immediately deploy instances.
- All Subnets in default VPC have a route out to the internet.
- Each EC2 instance has both a public and private IP address.


## VPC Overview

### IPv4 in VPC

- You can have multiple VPCs in a region (max is 5 per region, but it is a soft limit)
- Max CIDR per VPC is 5. For each CIDR
  - min size is `/28`: 16 IP addresses
  - max size is `/16`: 65536 IP addresses
- *Your VPC CIDR should not overlap with your other networks*


## Subnets Overview

AWS reserves **5** IPs (first 4 and last 1 in your IP ranges) in *each* subnet. These 5 IPs are not available for usage and cannot be assigned to an instance.

For example, if your CIDR block is `10.0.0.0/24`, then the reserved IPs are:

- `10.0.0.0`: Network address
- `10.0.0.1`: Reserved by AWS for the VPC Router
- `10.0.0.2`: Reserved by AWS for mapping to AWS-provided DNS
- `10.0.0.3`: Reserved by AWS for future usage
- `10.0.0.255`: Network broadcast address. AWS do not support broadcast in a VPC

:::tip

During exam, if you need xx IPs for EC2 instances, when doing your CIDR block, remember to minus 5 (round up)

for example, if you need 29 IPs, choose `/26` (64 IPs) not `/27` (32 IPs)

:::


## Internet Gateways

- Internet Gateways helps our VPC instances connect with the internet
- It scales horizontally and is HA and redundant
- Must be created separately from VPC
- One VPC can only be attached to one Internet Gateways and vice versa (like "1-to-1 relationship")
- Internet Gateway is also a NAT for the instances that have a public IPv4

**IGW on their own do not allow internet access, so Route tables must also be edited**


## NAT Instances and NAT Gateways

### NAT Instance (Outdated but in exam)

NAT stands for Network Address Translation, it allows *instances in private subnets* to connect ot the internet

- When you try to create a NAT Instance, **disable the source/destination check** on the instance first
- NAT instances must be in a **public subnet**.
- Route table must be configured to route traffic from the private subnet to the NAT instance, in order for this to work.
- Must have Elastic IP attached to it
- The amount of traffict that NAT instances can support depends on the **instance size**. If you are bottlenecking, increase the instance size.
- You can create **high availability** using Autoscaling Groups, multiple subnets in different AZs, and a script to automate failover.
- It is behind the Security Group

Must manage security groups and rules

- Inbound
  - Allow HTTP/HTTPS traffic from PRivate Subnets
  - Allow SSH from your home network (access provided through Internet Gateway)
- Outbound
  - Allow HTTP/HTTPS traffic to the internet


### NAT Gateway

- AWS managed NAT, higher bandwidth, better availability, no administration
- NAT Gateways are redundant inside the Availability Zone. **One NAT gateway per availability zone**.
- **Not associated with security groups**.
- NAT Gateway is created in a specific AZ, using an Elastic IP
- No needed to disable the source/destination check.
- In order to have high availability, we should create a NAT gateway in each availability zone.
- Starts at 5 Gbps and scales currently up to 45 Gbps. | **Scaled Automatically**
- Requires an Internet Gateway
  - Private Subnet will talk to NAT Gateway, which will talk to IGW, so that our private instance can talk to the internet


#### NAT Gateway with High Availability

- NAT Gateway is resilient within a signle-AZ
- However, you must create multiple NAT Gateway in multiple AZ for fault-tolerance
- There is no cross AZ failover needed because if an AZ goes down it does not need NAT

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/nat-gateway-with-ha.png)


### Comparison of NAT Instance and NAT Gateway

https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html


## DNS Resolution Options

- `enableDnsSupport` DNS Resolution setting
  - Default `True`
  - Helps decide if DNS resolution si supported for the VPC
  - If True, queries teh AWS DNS server at `169.254.169.253`
- `enableDnsHostname` DNS Hostname setting
  - `False` by default for custom VPC, `True` for Default VPC
  - Won't do anything unless `enableDnsSupport = True`
  - If True, Assign public hostname ot EC2 instance if it has a public

If you use custom DNS domain names in a private zone in Route 53, you mist set both these attributes to true


## NACL & Security Groups

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/nacl.png)

Inbound / Outbound for

- Security Group is **stateful**, which means, even if the outbound rule denies everything, if a inbound request passes, then this request can also pass the outbound (rule checking)
- NACL is **stateless**, which means, inbound and outbound are evaluated separately


### Network ACLs

- NACL are like are firewall which contol traffic from and to subnet
- Default NACL allows everything outbound and everything inbound
- **One NACL per Subnet, new subnets are assigned the Default NACL**
- Define NACL rules
  - Rules have a number (1 - 32766), the lower number, the higher precedence
    - for example, if you define `#100 ALLOW <IP>` and `#200 DENY <IP>`, IP will be allowed, since `100` has higher precedence
    - 100, 200 is rule number
  - Last rule is an asterisk (`*`) and denies a request in case of no rule match
  - *AWS recommends adding rules by increment of 100*
- Newly created NACL will deny everything
- NACL are a great way of blocking a specific IP at the subnet level

This works like a security group for all (or any) subnets in your VPC. We can add allow/deny rules. The default VPC comes a default network ACL, and by default it allows all outbound and inbound traffic.

When creating a custom network ACLs, by default denies all inbound and outbound traffic until you add rules. Each subnet in your VPC must be associated with a network ACL. If you don't explicitly associate a subnet with a network ACL, the subnet is automatically associated with the default network ACL.

In order to block IP Addresses, we need to use ACLs, not security groups.

- A network ACL can be associated to N subnets, but 1 subnet can only be associated to 1 ACL.
- Network ACLs contain a numbered list of rules that is evaluated in order, starting with the lowest numbered rule.
- Network ACLs have separate inbound and outbound rules, and each rule can either allow or deny traffic.
- Network ACLs are stateless; responses to allowed inbound traffic are subject to the rules for outbound traffic and vice versa.

#### Ephemeral Ports

In practice, to cover the different types of clients that might initiate traffic to public-facing instances in your VPC, you can open ephemeral ports `1024-65535`


### VPC How-To

1. Go To VPC service > Your VPCs > Create VPC
2. Fill IPv4 CIDR block and tenancy and click on create.

No subnets and internet gateways have been created at this moment. Route table, network ACLs and security groups have been created. Security groups can't span VPCs.

1. Go to Subnets -> Create subnet
2. Name it, select our VPC, the availability zone and the IPv4 CIDR block. Finally, click on create.

By default, no subnet has public IP. In order to do this, select the subnet and click on actions and make it auto apply public IP. *Amazon always reserve 5 IP addresses with your subnets.*

1. Go to Internet Gateways -> Create internet gateway
2. Name it and click on create.
3. Select it and with actions, attach the internet gateway to the VPC. (Only ONLY VPC can be attached to ONE internet gateway)

At the moment, all our VPC are public because our routes allow it. Let's fix this:

1. Go to Route Tables -> select our route table and select “Routes”
2. Edit routes
3. Fill destination (any IP) with target internet gateway
4. Go to Subnet Associations
5. Edit subnet associations in order to select the subnet that needs to be public.

Now, we can't ssh-access to our private ec2 instance from our public subnet.

1. Go to EC2 > Security Groups -> Create Security Group
2. Select our VPC, type “All ICMP” (protocol ICMP) and the source the public subnet.
3. Select our VPC, type “SSH” and the source the private subnet.
4. Change the security group of our ec2 instance.


## VPC Peering

- Allows you to connect one VPC with another via a **direct network route** using private IP addresses
- Instances behave as if they were on the same private network
- Must not have overlapping CIDR
- We can peer VPC's with other AWS accounts as well as with other VPCs in the same account
- You must update route tables in **each VPC's subnets** to ensure instances can communicate

Peering is a star configuration: 1 central VPC peers with 4 others

:::important

NO transitive peering

> reference: https://docs.aws.amazon.com/vpc/latest/peering/invalid-peering-configurations.html#transitive-peering

> You have a VPC peering connection between VPC A and VPC B (pcx-aaaabbbb), and between VPC A and VPC C (pcx-aaaacccc). There is no VPC peering connection between VPC B and VPC C. You cannot route packets directly from VPC B to VPC C through VPC A.
>
> To route packets directly between VPC B and VPC C, you can create a separate VPC peering connection between them (provided that they do not have overlapping CIDR blocks). For more information, see Three VPCs peered together.

![transitive peering](https://docs.aws.amazon.com/vpc/latest/peering/images/transitive-peering-diagram.png)

:::

- VPC Peering can work **inter-regionm, cross-account**
- You can reference a security group of a peered VPC (works across account)


## VPC Endpoints

- Endpoints allow you to connect to AWS Services using a private network instead of the public network
- Scales horizontally and are redundant
- Endpoints remove the need of IGW, NAT Gateway, etc.. to access AWS Services
- **Interface**: provisions an ENI (private IP address) as an entry point (must attach Security Group) for most AWS Services
- **Gateway**: provisions a target and must be used in a route table - S3 and DynamoDB
- In case of any issues:
  - Check DNS Setting Resolution in your VPC
  - Check Route Tables


> `Enable Private DNS Name`: To use private DNS names, ensure that the attributes `'Enable DNS hostnames'` and `'Enable DNS support'` are set to `'true'` for your VPC


An interface endpoint is an elastic network interface with a private IP address that serves as an entry point for traffic destined to a supported service.

A VPC endpoint enables you to privately connect your VPC to supported AWS services and VPC endpoint services powered by PrivateLink without requiring an internet gateway, NAT device, VPN connection or AWS Direct Connection. Instances in your VPC do not require public IP addresses to communicate with resources in the service. Traffic between your VPC and the other service does not have the Amazon network.

Endpoints are virtual devices. They are horizontally scaled, redundant, and highly available VPC components that allow communication between instances in your VPC and services without imposing availability risks or bandwidth constrains on your network traffic.

There are two types: interface and gateway. Currently, **gateway endpoints support S3 and DynamoDB**


## VPC Flow Logs

Flow Logs is a feature that enables you to **capture information about the IP traffic going to and from network interfaces in your VPC**. Flow log data is **stored using Amazon S3 / CloudWatch Logs**. After you've created a flow log, you can view and retrieve its data in Amazon CloudWatch Logs.

- There are three levels of abstraction:
  - VPC Flow Logs
  - Subnet Flow Logs
  - Elastic Network Interface Flow Logs
- HElps to monitor & troubleshoot connectivity issues
- You cannot enable flow logs for VPCs that are peered with your VPC unless the peer VPC is in your account.
- You cannot tag a flow log.
- After you've created a flow log, you cannot change its configuration; for example, you can't associate a different IAM role with the flow log.
- **Not ALL IP Traffic is monitored**
  - internal traffic done by AWS mostly
    - traffic generated by instances when they contact the AWS DNS Server
    - traffic generated by a windows instance
    - DHCP traffic / reserved IP Address (five addresses I believe ?)

To query VPC Flow Logs, we can use Athena on S3 or CLoudWatch Logs Insights


## Bastion Hosts

![](https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2017/11/15/NM_diagram_061316_a1.png)

- We use a Bastion Host to SSH into our private instances
- The bastion is in the public subnet which is then connected to all other private subnets
- Bastion Host security group must be tightened
- A Bastion is used to **securely** administer EC2 instances (using SSH or RDP).
- We **cannot** use a NAT Gateway as a Bastion host.


:::tip

Exam Tip: Make sure the bastion host only has port 22 traffic from the IP you need, not from the security groups of your other instances

:::


## Site-to-Site VPN

### Virtual Private Gateway

- VPN concentrator on the AWS side of the VPN connection
- VGW is created and attached to the VPC from which you want to create the Site-to-Site VPN connection
- Possibility to customize the ASN

### Customer Gateway

- Software application or physical device on customer side of the VPN connection
- IP Address
  - Use static, internet-routable IP adress for your customer gateway device
  - if behind a CGW behind NAT (NAT-T), use the public IP address of the NAT


## Direct Connect

AWS Direct Connect is a cloud service solution that makes it easy to establish a dedicated network connection from your premises to AWS. Therefore, we can establish private connectivity between AWS and your datacenter, office, or colocation environment, which in many cases can reduce your network costs, increase bandwidth throughput and provide a more consistent network experience than Internet-based connections.

- Provides a dedicated **private** connection from a remote network to your VPC
- Dedicated connection must be setup between your DC and AWS Direct Connect locations
- You need to setup a **Virtual Private Gateway** on your VPC
- Access public resources (S3) and private (EC2) on same connection
- Use cases:
  - Increase bandwidth throughput - working with large datasets, lower cost
  - More consistent network experience - applications using real-time data feeds
  - Hybrid Environments (on prem + cloud)
- Supports both IPv4 and IPv6

If you want to setup a Direct Connect to one or more VPC in many different regions (same account), you must use a Direct Connect Gateway


### Direct Connect - Connection Types

#### Dedicated Connections

- Physical ethernet port dedicated to a customer
- Request made to AWS first, then completed by Direct Connect Partners

#### Hosted Connections

- Connection requests are made via AWS Direct Connect Partners
- Capacity can be added or removed on demand
- 1,2,5,10 Gbps available at select AWS Direct Connection Partners

Lead times are often longer than 1 month to establish a new connection


### Direct Connect - Encryption

- Data in transit is **not encrypted** but is private
- AWS Direct Connect + VPN provides an IPsec-encrypted private connection
- Good for an extral level of security, but slightly more complex to put in place


## Egress Only Internet Gateway

> Egress means Outgoing

- Egress only Internet Gateway is for IPv6 only
- Similar function as a NAT, but a NAT is for IPv4
  - IPv6 are all public address
- Egress only Internet Gateway gives our UPv6 instances access to the internet, but they won't be directly reachable by the internet
- After creating an Egress only Internet Gateway, edit the route tables


## AWS PrivateLink (VPC Endpoints Services)

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/aws-privatelink.png)

- Most secure & scalable wayt o expose a service to 1000s of VPC (own or other accounts)
- Does not require VPC Peering, Internet Gateway, NAT, Route Tables
- Requires a network load balancer (Service VPC) and ENI (Customer VPC)


## AWS ClassicLink (Deprecated)

> EC2-Classic or AWS ClassicLink

- EC2-Classic: instances run in a single network shared with other customers
- Amazon VPC: your instances run logically isolated to your AWS account
- Classic Link: allows you to link EC2-Classic instances to a VPC in your account
  - Must associate a security group
  - Enables communication using private IPv4 addresses
  - Removes the need to make use of public IPv4 addresses or Elastic IP addresses

**Likely to be distractors at the exam**

## VPN CloudHub

- Provide secure communication between sites, if you have multiple VPN connections
- Low cost hub-and-spoke model for primary or secondary network connectivity between locations
- it's a VPN connection so it goes over the public internet


## VPC Section Summary


| Service                             | Description                                                                                                                                                                             |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CIDR                                | IP Range                                                                                                                                                                                |
| VPC                                 | Virtual Private Cloud => we define a list of IPv4 & IPv6 CIDR                                                                                                                           |
| Subnets                             | Tied to an AZ, we define a CIDR                                                                                                                                                         |
| Route Tables                        | Must be edited to add routes from subnets to the IGW, VPC Peering Connections, VPC Endpoints, etc..                                                                                     |
| NAT Instances                       | Gives internet access to instances in private subnets. Old, must be setup in a public subnet, disable `Source / Destination check` flag                                                 |
| NAT Gateway                         | Managed by AWS, provides scalable internet access to private instances, IPv4 only                                                                                                       |
| PRivate DNS + Route 53              | Enable DNS Resolution + DNS Hostnames (VPC)                                                                                                                                             |
| NACL                                | Stateless, subnet rules for inbound and outbound, don't forget ephemeralports                                                                                                           |
| Security Groups                     | Stateful, operate at the EC2 instance level                                                                                                                                             |
| VPC Peering                         | Connect two VPC with non overlapping CIDR, non transitive                                                                                                                               |
| VPC Endpoints                       | Provide private access to AWS Services (S3, DynamoDB, CloudFormation, SSM) within VPC                                                                                                   |
| VPC Flow Logs                       | Can be setup at the VPC / Subnet / ENI Level, for `ACCEPT` and `REJECT` traffic, helps identifying attacks, analyze using Athena or CloudWatch Log Insights                             |
| Bastion Host                        | Public instance to SSH into, that has SSH connectivity to instances in subnets                                                                                                          |
| Site to Site VPN                    | Setup a Customer Gateway on DC, a Virtual Private Gatewayon VPC, and site-to-site VPN over public internet                                                                              |
| Direct Connect                      | Setup a Virtual Private Gateway on VPC, and establish a direct private connection to an AWS Direct Connect Location                                                                     |
| Direct Connect Gateway              | Setup a Direct Connect to many VPCs in different regions                                                                                                                                |
| Internet Gateway Egress             | Like a NAT Gateway, but for IPv6                                                                                                                                                        |
| PrivateLink / VPC Endpoint Services | Connect services privately from your service VPC to customers VPC; Does not need VPC peering, public internet, NAT gateway, route tables; Must be used with Network Load Balancer & ENI |
| ClassicLink                         | Connect EC2-Classic instances priately to your VPC                                                                                                                                      |
| VPC CloudHub                        | Hub-and-spoke VPN model to conect your sites                                                                                                                                            |

