# EC2 base AMI

## Connect and update

Create a new instance starting from _Amazon Linux 2023 AMI_.

Connect via SSH with _ec2-user_.

Update all software.

```sh
sudo yum update -y
```

## Git

Install [Git](./tech-stack.md#git)

```sh
sudo yum install -y git
```

Configure git, setup credentials.

<!--
TODO: Does CodeCommit work? Use GitHub keys or CodeCommit



```sh
git config --global credential.helper '!aws codecommit credential-helper $@'

git config --global credential.UseHttpPath true
```

Double check there is a proper IAM role attached to the EC2 instance.

-->

Clone repository

<!--
```sh
git clone https://git-codecommit.eu-central-1.amazonaws.com/v1/repos/ggbot2-monorepo
```
-->

## Node

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

Go to [EC2 service]

## Setup service

Go to [EC2 service](./ec2-service.md).
