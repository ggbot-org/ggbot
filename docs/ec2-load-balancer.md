# EC2 Load Balancer

Service _binance-proxy_ uses an _Application Load Balancer_.

## Create Security Group

Create `ggbot2-binance-proxy-alb-sg` _Security group_, see [EC2 Security Groups](./ec2-security-groups.md).

## Create a Target Group

Create an _Target Group_, with name

```sh
ggbot2-${SERVICE}-${YYMMDD}-tg
```

for example `ggbot2-binance-proxy-230815-tg`.

Choose _Instances_ as target type.

Select protocol HTTP on port 3000 and protocol version HTTP1.

Set Health check path to `/health-check`

## Create Load Balancer

Create an _Application Load Balancer_, with name

```sh
ggbot2-${SERVICE}-${YYMMDD}-alb
```

for example `ggbot2-binance-proxy-230815-alb`.

Select _Internet-facing_ and IP address type _IPv4_.

Map all _Availability zones and subnets_.

Select `ggbot2-binance-proxy-alb-sg` _Security group_ (remove default _Security Group_).

In _Listeners and routing_ add a routing from protocol HTTPS to corresponding _Target Group_.

Select default SSL certificate from _ACM_ (choose ggbot2.com certificate).
