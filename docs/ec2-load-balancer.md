# EC2 Load Balancer

<!-- TODO remove this -->

Service _binance-proxy_ uses an _Application Load Balancer_.

## Create Security Group

Create `ggbot2-binance-proxy-alb-sg` _Security group_.

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

## Update DNS

<!-- TODO remove this -->

To be able to use ggbot2.com SSL certificate, add a DSN entry for the Load Balancer, for instance on Route 53.

-   Record name: `binance-proxy`
-   Flag _Alias_
-   Route traffic to _Alias to Application and Classic Load Balancer_
-   Region: Frankfurt
-   Select the Load Balancer name in the dropdown

Finally, update environment variable `BINANCE_PROXY_ORIGIN` accordingly.
