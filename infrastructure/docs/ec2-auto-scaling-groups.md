# EC2 Auto Scaling groups

Every one of the EC2 services has an [Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto_scaling_groups.html) associated.

## Launch Template

Create a _Launch template_ with name

```sh
${PROJECT_SHORT_NAME}_${SERVICE}_${YYMMDD}_lt
```

for example `ggbot_executor_230808_lt`.

Choose properly the following settings:

- Instance type
- Key pair (login)
- Security groups

TODO: try this (only for executor)

In _Advanced Details_: select _IAM instance profile_, and in _User data_ add a script like the following

```sh
cat << EOF > /etc/systemd/system/ggbot.service.d/override.conf
[Service]
Environment="DEPLOY_STAGE=next"
EOF

systemctl daemon-reload
systemctl enable ggbot
systemctl stop ggbot
systemctl start ggbot
```

## Auto Scaling group

Create _Auto Scaling group_ with name

```sh
${PROJECT_SHORT_NAME}_${SERVICE}_${YYMMDD}_asg
```

for example `ggbot_binance-proxy_230815_asg`.

Select _Launch template_.
Select all _Availability zones and subnets_.
If service is _binance-proxy_, select _Attach to an existing load balancer_ and select a proper _Target group_ from _Existing load balancer target groups_; otherwise select _No load balancer_.
Flag also _Turn on Elastic Load Balancing health checks_.
