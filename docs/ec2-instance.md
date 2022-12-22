# EC2 instance

TODO document security groups

## On local repo

Upload code

```sh
aws s3 rm --recursive s3://code.ggbot2.com/main
npm run cleanup
aws s3 sync --exclude '.git*' --exclude 'node_modules/*' . s3://code.ggbot2.com/main/ggbot2/
```

## On remote server

Connect with ec2-user to an *Amazon Linux 2 AMI* instance, then launch

Update to latest packages: `sudo yum update -y`.

### Set environment

```sh
export NEXT_PUBLIC_NODE_ENV=production
export DEPLOY_STAGE=main
export NEXT_PUBLIC_DEPLOY_STAGE=main
```

### Install Node.js v16

NOTA BENE: Node.js v18 requires glibc v2.8, not available yet on Amazon Linux.

```sh
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
```

### Get code and build

```sh
sudo rm -rf /opt/ggbot2
sudo mkdir -p /opt/ggbot2
sudo chown ec2-user:ec2-user /opt/ggbot2
aws s3 sync s3://code.ggbot2.com/main/ggbot2/ /opt/ggbot2/
cd /opt/ggbot2
```

Install deps and build

```sh
npm ci
npm run build
npm run next:build:user-webapp
```

### Create ggbot2-user-webapp service


Launch

```sh
sudo vi /lib/systemd/system/ggbot2-user-webapp.service
```

Add the following content

```
[Unit]
Description=crypto flow
Documentation=https://ggbot2.com
After=network.target

[Service]
Type=simple
User=ec2-user
Group=ec2-user
WorkingDirectory=/opt/ggbot2/
ExecStart=/usr/bin/npm run start:user-webapp
Restart=on-failure
RestartSec=10
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

Add more environment variables via systemd override.

```sh
sudo systemctl edit ggbot2-user-webapp
```

This will create a /etc/systemd/system/ggbot2-user-webapp.service.d/override.conf file, add the following variables with proper values.

```
[Service]
Environment="AWS_ACCOUNT_ID=xxx"
Environment="AWS_ACCESS_KEY_ID=xxx"
Environment="AWS_SECRET_ACCESS_KEY=xxx"
Environment="DEPLOY_STAGE=main"
Environment="NEXT_PUBLIC_DEPLOY_STAGE=main"
```

Command `systemctl edit` uses nano, to "exit and save" do `CTRL-x SHIFT-Y ENTER`.

You can edit override file with

```sh
sudo systemctl edit ggbot2-user-webapp
```

Tell systemd that there is a new service, run only once

```sh
sudo systemctl daemon-reload
```

Enable the service to start at boot:

```sh
sudo systemctl enable ggbot2-user-webapp
```

The following commands are available:

- Check service status: `sudo systemctl status ggbot2-user-webapp`
- Start service: `sudo systemctl start ggbot2-user-webapp`
- Stop service: `sudo systemctl stop ggbot2-user-webapp`


Start service and check its status

```sh
sudo systemctl start ggbot2-user-webapp
sudo systemctl status ggbot2-user-webapp
```

### Create ggbot2-executor service


Launch

```sh
sudo vi /lib/systemd/system/ggbot2-executor.service
```

Add the following content

```
[Unit]
Description=crypto flow executor
Documentation=https://ggbot2.com
After=network.target

[Service]
Type=simple
User=ec2-user
Group=ec2-user
WorkingDirectory=/opt/ggbot2/
ExecStart=/usr/bin/npm run start:executor
Restart=on-failure
RestartSec=10
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

Add environment variables via systemd override.

```sh
sudo systemctl edit ggbot2-executor
```

Add content

```
[Service]
Environment="AWS_ACCOUNT_ID=xxx"
Environment="AWS_ACCESS_KEY_ID=xxx"
Environment="AWS_SECRET_ACCESS_KEY=xxx"
Environment="DEPLOY_STAGE=main"
```

You can edit override file with

```sh
sudo systemctl edit ggbot2-executor
```

Tell systemd that there is a new service and enable service start at boot

```sh
sudo systemctl daemon-reload
sudo systemctl enable ggbot2-executor
```

Start service and check its status

```sh
sudo systemctl start ggbot2-executor
sudo systemctl status ggbot2-executor
```
