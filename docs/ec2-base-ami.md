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

Install [Node.js](./tech-stack.md#nodejs)

```sh
sudo yum install -y nodejs
```

Check which Node.js version was installed, it should be `v18.x`

```sh
node --version
```

Update [NVM](./tech-stack.md#nvm) config with latest version.

Create an image with a related name, for instance `ggbot2-amazon_linux_2023-nodejs_v18.12.1`.
