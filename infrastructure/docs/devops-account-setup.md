# Devops account

Create a _devops_ account. Name it as `${PROJECT_SHORT_NAME}-devops`, for instance _ggbot-devops_.

Generate IAM policies with

```sh
npm run generate_iam_policies
```

Go to AWS console in _IAM > Policies_ and click _Create policy_.
Choose name `${PROJECT_SHORT_NAME}-devops-policy`, for instance _ggbot-devops-policy_.
Add the corresponding JSON you find in the [infrastructure/iam folder](../iam/).

Go to _IAM > Users_ and click _Create user_.
As user name, choose `${PROJECT_SHORT_NAME}-devops`, for instance _ggbot-devops_.
On "Set permissions" choose "Attach policies directly" and choose previously created policy.

Once the user is created, go to user IAM page, for instance _IAM > Users > ggbot-devops_. Go to _Security credentials_ tab and click _Create access key_.
Get the access keys and set environment variables:

-   `AWS_ACCESS_KEY_ID`
-   `AWS_SECRET_ACCESS_KEY`
