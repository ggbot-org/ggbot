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

Install _Git_.

```sh
sudo yum install -y git
```

Clone repository

```sh
git clone https://github.com/ggbot-org/ggbot.git
```

## Node

Install _Node.js_.

```sh
sudo yum install -y nodejs
```

Check which Node.js version was installed.

```sh
node --version
```

Check taht `volta` attribute in [package.json](../../package.json) is compatible, see also [Node.js section](../../repository/docs/tech-stack.md#nodejs) on Teck Stack docs.

## Create AMI

Create an image, with name

```sh
${PROJECT_SHORT_NAME}_base_${YYMMDD}
```

for example `ggbot_base_230402`.
