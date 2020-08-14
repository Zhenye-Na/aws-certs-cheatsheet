---
id: chapter05
title: Virtual Private Cloud
sidebar_label: VPC
---

# Virtual Private Cloud (VPC)


![Virtual Private Cloud](https://sgitario.github.io/images/aws-vpn-1.png)

> image source: https://sgitario.github.io/aws-certified-solutions-architect-summary/



VPC lets us provision a **logically isolated** section of our infrastructure where we can launch AWS resources in a virtual network that we define. We have complete control over:

- our virtual networking environment, including selection of our own IP address range, creation of subnets
- configuration of route tables
- network gateways

Additionally, we can create a hardware VPN connection between our corporate datacenter and our VPC and leverage the AWS cloud as an extension of our corporative datacenter.Default 

## VPC vs Custom VPC

- Default VPC
  - user friendly, allowing you to immediately deploy instances.
  - All Subnets in default VPC have a route out to the internet.
  - Each EC2 instance has both a public and private IP address.


## VPC Peering (VPC <–> VPC)

- Allows you to connect one VPC with another via a **direct network route** using private IP addresses
- Instances behave as if they were on the same private network
- We can peer VPC's with other AWS accounts as well as with other VPCs in the same account

Peering is a star configuration: 1 central VPC peers with 4 others

:::important

NO transitive peering

> reference: https://docs.aws.amazon.com/vpc/latest/peering/invalid-peering-configurations.html#transitive-peering

> You have a VPC peering connection between VPC A and VPC B (pcx-aaaabbbb), and between VPC A and VPC C (pcx-aaaacccc). There is no VPC peering connection between VPC B and VPC C. You cannot route packets directly from VPC B to VPC C through VPC A.
>
> To route packets directly between VPC B and VPC C, you can create a separate VPC peering connection between them (provided they do not have overlapping CIDR blocks). For more information, see Three VPCs peered together.

![transitive peering](https://docs.aws.amazon.com/vpc/latest/peering/images/transitive-peering-diagram.png)

:::



## How-To

1. Go To VPC service > Your VPCs > Create VPC
2. Fill IPv4 CIDR block and tenancy and click on create.

No subnets and internet gateways have been created at this moment. Route table, network ACLs and security groups have been created. Security groups can't span VPCs.

1. Go to Subnets -> Create subnet
2. Name it, select our VPC, the availability zone and the IPv4 CIDR block. Finally, click on create.

By default, no subnet has public IP. In order to do this, select the subnet and click on actions and make it auto apply public IP. Amazon always reserve 5 IP addresses with your subnets.

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


## NAT Instances and NAT Gateways


### NAT Instance

- When you try to create a NAT Instance, **disable the source/destination check** on the instance first
- NAT instances must be in a **public subnet**.
- There must be a route out of the private subnet to the NAT instance, in order for this to work.
- The amount of traffict that NAT instances can support depends on the **instance size**. If you are bottlenecking, increase the instance size.
- You can create **high availability** using autoscaling groups, multiple subnets in different AZs, and a script to automate failover.
- It is behind the Security Group

### NAT Gateway

- NAT Gateways are redundant inside the Availability Zone. **One NAT gateway per availability zone**.
- Preferred by the enterprise.
- Starts at 5Gbps and scales currently up to 45 Gbps. | **Scaled Automatically**
- No need to patch
- **Not associated with security groups**.
- Automatically assigned a public IP address.
- No needed to disable the source/destination check.
- In order to have high availability, we should create a NAT gateway in each availability zone.



## Network Access Control Lists (ACL)

This works like a security group for all(or any) subnets in your VPC. We can add allow/deny rules. The default VPC comes a default network ACL, and by default it allows all outbound and inbound traffic.

When creating a custom network ACLs, by default denies all inbound and outbound traffic until you add rules. Each subnet in your VPC must be associated with a network ACL. If you don't explicitly associate a subnet with a network ACL, the subnet is automatically associated with the default network ACL.

In order to block IP Addresses, we need to use ACLs, not security groups.

- A network ACL can be associated to N subnets, but 1 subnet can only be associated to 1 ACL.
- Network ACLs contain a numbered list of rules that is evaluated in order, starting with the lowest numbered rule.
- Network ACLs have separate inbound and outbound rules, and each rule can either allow or deny traffic.
- Network ACLs are stateless; responses to allowed inbound traffic are subject to the rules for outbound traffic and vice versa.

## VPC Flow Logs

Flow Logs is a feature that enables you to capture information about the IP traffic going to and from network interfaces in your VPC. Flow log data is stored using Amazon CloudWatch Logs. After you've created a flow log, you can view and retrieve its data in Amazon CloudWatch Logs.

- There are three levels of abstraction:
  - VPC
  - subnet
  - network access level.
- You cannot enable flow logs for VPCs that are peered with your VPC unless the peer VPC is in your account.
- You cannot tag a flow log.
- After you've created a flow log, you cannot change its configuration; for example, you can't associate a different IAM role with the flow log.
- Not ALL IP Traffic is monitored
  - internal traffic done by AWS mostly
    - traffic generated by instances when they contact the AWS DNS Server
    - traffic generated by a windows instance
    - DHCP traffic / reserved IP Address (five addresses I believe ?)



### Bastion Hosts

- A Bastion is used to **securely** administer EC2 instances (using ssh or RDP).
- We **cannot** use a NAT Gateway as a Bastion host.

### Direct Connect

AWS Direct Connect is a cloud service solution that makes it easy to establish a dedicated network connection from your premises to AWS. Therefore, we can establish private connectivity between AWS and your datacenter, office, or colocation environment, which in many cases can reduce your network costs, increase bandwidth throughput and provide a more consistent network experience than Internet-based connections.

### VPC Endpoint

An interface endpoint is an elastic network interface with a private IP address that serves as an entry point for traffic destined to a supported service.

A VPC endpoint enables you to privately connect your VPC to supported AWS services and VPC endpoint services powered by PrivateLink without requiring an internet gateway, NAT device, VPN connection or AWS Direct Connection. Instances in your VPC do not require public IP addresses to communicate with resources in the service. Traffic between your VPC and the other service does not have the Amazon network.

Endpoints are virtual devices. They are horizontally scaled, redundant, and highly available VPC components that allow communication between instances in your VPC and services without imposing availability risks or bandwidth constrains on your network traffic.

- There are two types: interface and gateway
- Currently, gateway endpoints support S3 and DynamoDB

## Elastic Load Balancer (ELB)


There are three types of Load Balancers

1. Application Load Balancer
2. Network Load Balancer
3. Classic Load Balancer

> more details, please refer here: https://aws.amazon.com/elasticloadbalancing/

### Application Load Balancer

It balances HTTP / HTTPS traffic, you can also create

- advanced request routing
- sending specific requests to specific web servers

### Network Load Balancer

It balances TCP traffic

Network Load Balancer is able to handle millions of requests per second while maintaining ultra-low latencies


### Classic Load Balancer

This is just legacy Load Balancers


:::info

suggest reading:

- Elastic Load Balancing FAQs: https://aws.amazon.com/elasticloadbalancing/faqs/?nc=sn&loc=6

:::


## Advanced Load Balancer Theory

### Sticky Sessions

Sticky Session allows you to bind a user's session to a specific EC2 Instance. This ensures that all requests from the user during the session are sent to the same instance

you can enable the "sticky session" for Application Load Balancer, but the traffic will be sent at the "Target Group" level, rather than Individual EC2 Instance

### Cross-zone Load Balancing

> With cross-zone load balancing, each load balancer node for your Classic Load Balancer distributes requests evenly across the registered instances in all enabled Availability Zones. If cross-zone load balancing is disabled, each load balancer node distributes requests evenly across the registered instances in its Availability Zone only.
> 
> https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-disable-crosszone-lb.html


### Path Patterns

This creates a listener with rules to forward requests based on teh URL Path -> "path-based routing"


:::tip

1. Stickey Session is useful when user sotring information locally to that instance, more like a online file storage server, like Box or Dropbox ?
2. Cross-zone Load Balancing eables you to balance loads across multiple AZs
3. Path Patterns are just "path-based routing", it is based on the url path in the requests

:::

