# EC2 base AMI

## Connect and update

Create a new instance starting from _Amazon Linux 2023 AMI_.

See [how to launch EC2 instance](./ec2-launch-instance.md).

Update all software.

```sh
sudo yum update -y
```

Check also if there is a new Amazon Linux release, run

```sh
/usr/bin/dnf check-release-update
```

or check the shell prompt on SSH login.

## Git

Install [Git](./tech-stack.md#git)

```sh
sudo yum install -y git
```

Clone repository

```sh
git clone https://github.com/ggbot-org/ggbot.git
```

<!-- TODO remove this, it was an attempt to use AWS codecommit

Configure git, setup credentials.

```sh
git config --global credential.helper '!aws codecommit credential-helper $@'

git config --global credential.UseHttpPath true
```

Clone repository

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

<-- TODO is this still valid? check latest node version
it should also contain a test to check nvmrc
-->
Update [Node.js section](./tech-stack.md#nodejs) with latest version.

## Create AMI

Create an image, with name

```sh
ggbot_base_${YYMMDD}
```

for example `ggbot_base_230402`.
