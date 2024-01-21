# EC2 Security Groups

## EC2 base

Create a _Security Group_ with name `ggbot2-base-ec2-sg` with

Inbound rule: type SSH with source _My IP_.
Outbound rule: _All Traffic_.

## executor

Create a _Security Group_ with name `ggbot2-executor-ec2-sg` with same rules as [EC2 base](#ec2-base).
Description can be: ggbot2 executor EC2 service.

## binance-proxy

Create a _Security Group_ with name `ggbot2-binance-proxy-ec2-sg` with same rules as [EC2 base](#ec2-base).
Description can be: ggbot2 binance-proxy EC2 service.

Create a _Security Group_ with name `ggbot2-binance-proxy-alb-sg`.
Description can be: ggbot2 binance-proxy Load Balancer.

Inbound rules:

-   Type HTTPS, source _Anywhere-IPv4_, description "all HTTPS IPv4"
-   Type HTTPS, source _Anywhere-IPv6_, description "all HTTPS IPv6"

Outbound rule: type _Custom TCP_, port range 3000, destination _Custom_ and select `ggbot2-binance-proxy-ec2-sg` in the dropdown, description "ggbot2 binance-proxy EC2 service".

Go back to _Security Group_ `ggbot2-binance-proxy-ec2-sg` and add

Inbound rule: type _Custom TCP_, port range 3000, destination _Custom_ and select `ggbot2-binance-proxy-alb-sg` in the dropdown, description "ggbot2 binance-proxy Load Balancer".
