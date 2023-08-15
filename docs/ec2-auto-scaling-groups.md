# EC2 Auto Scaling groups

Every one of the [EC2 services](./ec2_services.md) has an [Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto_scaling_groups.html) associated.

Create a _Launch template_ with name

```sh
ggbot2_${DEPLOY_STAGE}_${SERVICE}_${YYMMDD}_lt
```

for example `ggbot2_next_executor_230808_lt`.

Create _Auto Scaling group_ with name

```sh
ggbot2_${DEPLOY_STAGE}_${SERVICE}_${YYMMDD}_asg
```

for example `ggbot2_next_executor_230808_asg`.

Select _Launch template_.
Select all _Availability zones and subnets_.
Select _No load balancer_.

If service is _binance-proxy_ go to [EC2 Load Balancer](./ec2-load-balancer.md)
