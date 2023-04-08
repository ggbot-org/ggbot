# EC2 base AMI

Create a new instance starting from *Amazon Linux 2023 AMI*.

Connect via SSH with *ec2-user*.

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

TODO
start from previous image
add environment variables, systemctl, etc.
do not enable services at boot
create image `ggbot2-base-202303`

Start a new instance from latest base image.
Pull code and build.
Enable services at boot.

```sh
sudo systemctl enable ggbot2-user-webapp
```

```sh
sudo systemctl enable ggbot2-executor
```

