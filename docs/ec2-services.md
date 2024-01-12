# EC2 service

EC2 services that powers ggbot are implemented by the following workspaces:

-   [binance-proxy](../binance-proxy/)
-   [executor](../executor/)

Every EC2 instance run only one of those services, the following instructions differ by:

-   The npm commands to build and start the service.
-   The environment variables required by the service.
-   The AMI permissions that the service needs to be granted.

Since there is one service per EC2 instance, the service name will be always _ggbot_.

See [how to launch EC2 instance](./ec2-launch-instance.md).

## Deploy stage

First of all, define the _Deploy stage_: it can be `main` or `next`.

## Update code

```sh
cd ggbot
git pull
npm ci --include=optional
```

## Build

-   binance-proxy: `npm run build:binance-proxy`
-   executor: `npm run build:executor`

## Create service

Switch to **root** user: `sudo su -`.

Set `SERVICE` either to:

-   `export SERVICE=binance-proxy`
-   `export SERVICE=executor`

Then run the following.

```sh
cat << EOF > /lib/systemd/system/ggbot.service
[Unit]
Description=crypto flow
Documentation=https://ggbot2.com
After=network.target

[Service]
Type=simple
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/ggbot
ExecStart=/usr/bin/npm run start:$SERVICE
Restart=on-failure
RestartSec=10
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOF
```

Go back to _ec2-user_: `exit` (or <kbd>CTRL-d</kbd>).

System service can be edited also by _ec2-user_ with this command:

```sh
sudo vi /lib/systemd/system/ggbot.service
```

## Edit environment variables

Add more environment variables via systemd override.

```sh
sudo systemctl edit ggbot
```

This will create a /etc/systemd/system/ggbot.service.d/override.conf file, add environment variables with proper values.

For example for _binance-proxy_ service

    [Service]
    Environment="AWS_ACCOUNT_ID=888671539518"
    Environment="AWS_DATA_REGION=eu-central-1"
    Environment="BINANCE_PROXY_BASE_URL=https://binance-proxy.ggbot2.com"
    Environment="DEPLOY_STAGE=main"
    Environment="DNS_DOMAIN=ggbot2.com"
    Environment="PROJECT_SHORT_NAME=ggbot"

For example for _executor_ service

    [Service]
    Environment="AWS_ACCOUNT_ID=888671539518"
    Environment="DEPLOY_STAGE=main"
    Environment="DNS_DOMAIN=ggbot2.com"
    Environment="BINANCE_PROXY_BASE_URL=https://binance-proxy.ggbot2.com"

Notice that command `systemctl edit` uses nano, to "exit and save" do <kbd>CTRL-x</kbd> <kbd>SHIFT-y</kbd> <kbd>ENTER</kbd>.

## Update configuration

Tell _systemd_ that configuration was updated.

```sh
sudo systemctl daemon-reload
```

## Enable service

Tell _systemd_ there is a new service and to launch it at boot.

```sh
sudo systemctl enable ggbot
```

## Add service aliases

```sh
mkdir -p ~/.bashrc.d

cat << EOF > ~/.bashrc.d/ggbot-aliases.sh
alias start='sudo systemctl start ggbot'
alias stop='sudo systemctl stop ggbot'
alias status='sudo systemctl status ggbot'
alias logs='journalctl --follow --unit ggbot.service'
EOF
```

## Create AMI

Create an image, with name

```sh
ggbot_${SERVICE}_${YYMMDD}
```

for example `ggbot_executor_230804`.

Go to [EC2 Auto Scaling groups](./ec2-auto-scaling-groups.md)
