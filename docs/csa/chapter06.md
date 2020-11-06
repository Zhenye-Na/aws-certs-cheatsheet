---
id: chapter06
title: High Availability and Scalability - ELB & ASG
sidebar_label: HA Architecture
---

# High Availability and Scalability - ELB & ASG

## Scalability

When it comes to scalability, it divides to two parts:

1. Horizontal Scalability -> elasticity, we also call this **scale up and scale down**
2. Vertical Scalability -> we also call this **scale in and scale out**

**Horizontal Scalability**

increase the number of instances/systems, distributed system

**Vertical Scalability**

increase the size of the instance, like from t2.micro to t2.large, etc..


## HA (High Availability)

HA (High Availability) is a plan for failure, you should prepare for

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


High Availability:

1. HA usually goes hand-in-hand with *Horizontal Scalability*
2. HA means running your application / system in at least 2 data centers, to be specific, 2 AZs
3. HA can be both *active* or *passive*
   1. active : Horizontal Scalability
   2. passive : RDS Multi-AZ


There are two methods of Horizontal Scaling:

- Auto Scaling Group - ASG
- Load Balancer


## Load Balancing (Elastic Load Balancer - ELB)

Load Balancers are servers that forward internet traffic to multiple servers (EC2) downstream

But, why would we use a load balancer, anyway?

- Spread load across multiple downstream instances
- Expose a single point of access (DNS) to your application
- Seamlessly handle failures of downstream instances, through health checks
- Do regular health checks to your instances
- Provide SSL Termination (HTTPS) for your website
- Enforce stickiness with cookies
- HA across AZs
- Separate public traffic from private traffic


There are three types of Load Balancers on AWS

1. Application Load Balancer
   1. HTTP, HTTPS, WebSocket
   2. supports SSL
2. Network Load Balancer
   1. TCP, TLS (secure TCP) & UDP
   2. supports SSL
3. Classic Load Balancer
   1. HTTP, HTTPS, TCP
   2. DO NOT support SSL

You can setup *internal/private* or *external/public* ELBs

> more details, please refer here: https://aws.amazon.com/elasticloadbalancing/

### Application Load Balancer (ALB)

It balances HTTP / HTTPS traffic, you can also create

- advanced request routing
- sending specific requests to specific web servers

**Target Groups**

> Each *target group* is used to route requests to one or more registered targets.

where targets can be:

- EC2 Instances (can be managed by an ASG) - HTTP
- ECS tasks (Elastic Container Service) - HTTP
- Lambda functions - HTTP request if translated into a JSON event
- IP Address - must be private IPs

ALB can also route to multiple target groups, also, Health checks are at teh target group level

:::note

Good to know about ALB

- it has fixed hostname, (`xxx.<region>.elb.amazonaws.com`, etc..)
- the application servers don't see the IP of the client *directly*, if you wanna see, then:
  - the true IP of the client is inserted in the header `X-Forwarded-For`
  - we can also get the Port (`X-Forwarded-Port`) and proto (`X-Forwarded-Proto`)

:::

### Network Load Balancer (NLB)

It balances TCP (layer 4) traffic

Forward TCP & UDP traffic to your instances. Network Load Balancer is able to handle millions of requests per second while maintaining ultra-low latencies, ~100ms, where 400ms for ALB

NLB has <u>one static IP per AZ</u> and supports assigning Elastic IP

Normally, NLB are used for extreme performance, TCP or UDP traffic


### Classic Load Balancer (CLB)

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

![](https://image.slidesharecdn.com/thuandb-elb-deepdiveandbestpractices-awsvn-161123105843/95/meetup-4-aws-elb-deep-dive-best-practices-15-638.jpg)

- With Cross Zone Load Balancing each load balancer instance distributes evenly across *all registered instances in all AZ*
- Otherwise, each load balancer node distributes requests evenly across the registered instances in its AZ only

Cross-Zone in 3 types of Load Balancers

1. Application Load Balancer
   1. Always on (cannot be disabled)
   2. No charges for inter AZ data
2. Network Load Balancer
   1. Disabled by default
   2. You pay charges for inter AZ data if enabled
3. Classic Load Balancer
   1. Disabled by default
   2. No charges for inter AZ data if enabled


### Path Patterns

This creates a listener with rules to forward requests based on teh URL Path -> "path-based routing"


:::tip

1. Stickey Session is useful when user sotring information locally to that instance, more like a online file storage server, like Box or Dropbox ?
2. Cross-zone Load Balancing eables you to balance loads across multiple AZs
3. Path Patterns are just "path-based routing", it is based on the url path in the requests

:::

## Auto Scaling Group (ASG)

the goal fo an ASG is to:

1. Scale in or scale out to match an increased load or decreased load
2. Ensure minimum / maximum number of running instances
3. automatically register new instances to a load balancer

![](/img/asg.png)

### Scaling Policies

- Target Tracking Scaling
  - Most simple and easy to set-up
  - Example I want the average ASG CPU to stay at around 40%
- Simple / Step Scaling
  - When some metrics is triggered, do something
- Scheduled Actions
  - eg. increase the min capacity to 10 at 5 pm ..



## Elastic Beanstalk

Deploy application to AWS without actually knowing AWS

Elastic Beanstalk automatically handles the details of capacity provisioning load balancing, scaling and application health monitoring
