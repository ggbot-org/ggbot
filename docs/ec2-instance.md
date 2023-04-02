# EC2 instance

TODO document security groups

## On local repo

Update code on CodeCommit.

```sh
git fetch
git switch main
git pull origin main
git push aws_codecommit main
```

## On remote server

Connect to EC2 instance created from [base AMI](./ec2-base-ami.md).

If services are already configured, and environment is loaded on login,
create an update.sh script with the following content

```sh
### Update deps
sudo yum update -y

### Get code and build
cd ggbot2-monorepo
npm ci
export NODE_ENV=production
npm run build
npm run next:build:user-webapp
```

If it is a previous AMI, just launch the update.sh script to get the job done.

```sh
sh update.sh
```

Follows steps with details.

Update to latest packages: `sudo yum update -y`.

### Get code and build

Install deps

```sh
npm ci
```

### Set environment

```sh
export NODE_ENV=production
export DEPLOY_STAGE=main
export UTRUST_API_KEY=xxx
export UTRUST_=xxx
```

Notice that `NODE_ENV` is set to production after installing npm deps, otherwise
it will install only production deps, while for build we need also dev deps.

Also notice that environment is used also by `npm run generate:user-webapp:env`
script which is run automatically after build.

Make it persistent, add to *~/.bashrc* all variable exports except `NODE_ENV`.

Build

```sh
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
