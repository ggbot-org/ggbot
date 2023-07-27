# EC2 base AMI

Create a new instance starting from _Amazon Linux 2023 AMI_.

Connect via SSH with _ec2-user_.

Update all software.

```sh
sudo yum update -y
```

Install [Git](./tech-stack.md#git)

```sh
sudo yum install -y git
```

Configure git, setup credentials helper

```sh
git config --global credential.helper '!aws codecommit credential-helper $@'

git config --global credential.UseHttpPath true
```

Double check there is a proper IAM role attached to the EC2 instance.

Try to clone repository

```sh
git clone https://git-codecommit.eu-central-1.amazonaws.com/v1/repos/ggbot2-monorepo
```

Install [Node.js](./tech-stack.md#nodejs)

```sh
sudo yum install -y nodejs
```

Check which Node.js version was installed, it should be `v18.x`

```sh
node --version
```

Update [NVM](./tech-stack.md#nvm) config with latest version.

Create an image, for instance named as `ggbot2-2023-nodejs-v18.12.1`.

<!--
TODO
start from previous image
add environment variables, systemctl, etc.
create image `ggbot2-base-202303`

Start a new instance from latest base image.
Pull code and build.

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
WorkingDirectory=/home/ec2-user/ggbot2-monorepo
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
WorkingDirectory=/home/ec2-user/ggbot2-monorepo
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

-->
