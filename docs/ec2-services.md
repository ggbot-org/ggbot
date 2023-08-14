# EC2 service

EC2 services that powers ggbot2 are implemented by the following workspaces:

- [binance-proxy](../binance-proxy/)
- [executor](../executor/)

Every EC2 instance run only one of those services, the following instructions differ by:

- The npm commands to build and start the service.
- The environment variables required by the service.
- The AMI permissions that the service needs to be granted.

Since there is one service per EC2 instance, the service name will be always _ggbot2_.

Start from latest image created with steps described in [EC2 base AMI](./ec2-base-ami.md).

See [how to launch EC2 instance](./ec2-launch-instance.md).

## Deploy stage

First of all, define the _Deploy stage_: it can be `main` or `next`.

## Update code

```sh
cd ggbot2-monorepo
git pull
npm ci
```

## Build

- binance-proxy: `npm run build:binance-proxy`
- executor: `npm run build:executor`

## Create service

Switch to **root** user: `sudo su -`.

Set `SERVICE` either to:

- `export SERVICE=binance-proxy`
- `export SERVICE=executor`

Then run the following.

```sh
cat << EOF > /lib/systemd/system/ggbot2.service
[Unit]
Description=crypto flow
Documentation=https://ggbot2.com
After=network.target

[Service]
Type=simple
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/ggbot2-monorepo
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
sudo vi /lib/systemd/system/ggbot2.service
```

## Enable service

Tell _systemd_ there is a new service and to launch it at boot.

```sh
sudo systemctl daemon-reload
sudo systemctl enable ggbot2
```

## Edit environment variables

Add more environment variables via systemd override.

```sh
sudo systemctl edit ggbot2
```

This will create a /etc/systemd/system/ggbot2.service.d/override.conf file, add the following variables with proper values.

```
[Service]
Environment="AWS_ACCESS_KEY_ID=xxx"
Environment="AWS_SECRET_ACCESS_KEY=xxx"
Environment="DEPLOY_STAGE=main"
Environment="BINANCE_PROXY_BASE_URL=http://3.68.165.141:8080"
```

Notice that:

- Services use a different set of environment variables, those not used can be removed or ignored even if wrong. For example for _binance-proxy_ service `AWS_ACCESS_KEY_ID=anyvalue` is fine.
- Command `systemctl edit` uses nano, to "exit and save" do <kbd>CTRL-x</kbd> <kbd>SHIFT-y</kbd> <kbd>ENTER</kbd>.

## Enable service

Tell _systemd_ that configuration was updated.

```sh
sudo systemctl daemon-reload
```

## Add service aliases

```sh
mkdir -p ~/.bashrc.d

cat << EOF > ~/.bashrc.d/ggbot2-aliases.sh
alias start='sudo systemctl start ggbot2'
alias stop='sudo systemctl stop ggbot2'
alias status='sudo systemctl status ggbot2'
alias logs='journalctl --follow --unit ggbot2.service'
EOF
```

## Create AMI

Create an image, with name

```sh
ggbot2_${DEPLOY_STAGE}_${SERVICE}_${YYYYMMDD}
```

for example `ggbot2_next_executor_2023-08-04`.

Go to [EC2 Auto Scaling groups](./ec2-auto-scaling-groups.md)
