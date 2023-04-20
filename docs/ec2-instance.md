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

Check for updates

```sh
/usr/bin/dnf check-release-update
```

Update and build ggbot2.

```sh
cd ggbot2-monorepo
git pull origin main
npm ci
export NODE_ENV=production
npm run build
```

Enable the service to start at boot:

```sh
sudo systemctl enable ggbot2-executor
sudo systemctl enable ggbot2-user-webapp
```

