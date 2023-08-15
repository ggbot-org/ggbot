# How to launch EC2 instance

Choose latest image created with steps described in [EC2 base AMI](./ec2-base-ami.md).

In _Network settings_ section choose _Security Group_: see [EC2 Security Groups](./ec2-security-groups.md).

In _Advanced details_ section choose _IAM instance profile_. (TODO complete this, profile must have CodeCommit readonly permission).

Connect via SSH with _ec2-user_.
