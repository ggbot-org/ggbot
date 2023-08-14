# EC2 base AMI

## Connect and update

Create a new instance starting from _Amazon Linux 2023 AMI_.

See [how to launch EC2 instance](./ec2-launch-instance.md).

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

```sh
git config --global credential.helper '!aws codecommit credential-helper $@'

git config --global credential.UseHttpPath true
```

Clone repository

```sh
git clone https://git-codecommit.eu-central-1.amazonaws.com/v1/repos/ggbot2-monorepo
```

## Node

Install [Node.js](./tech-stack.md#nodejs)

```sh
sudo yum install -y nodejs
```

Check which Node.js version was installed, it should be `v18.x`

```sh
node --version
```

Update [Node.js section](./tech-stack.md#nodejs) with latest version.

## Create AMI

Create an image, with name

```sh
ggbot2_base_${YYYYMMDD}
```

for example `ggbot2_base_2023-04-02`.

Go to [EC2 service]

## Setup service

Go to [EC2 services](./ec2-services.md).
