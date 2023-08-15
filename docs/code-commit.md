# ggbot2 code on AWS CodeCommit

Repo here: https://eu-central-1.console.aws.amazon.com/codesuite/codecommit/repositories/ggbot2-monorepo/browse?region=eu-central-1

Add git remote to local repository

```sh
git remote add aws_codecommit ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/ggbot2-monorepo
```

Done that, to update CodeCommit launch

```sh
git push aws_codecommit main
```

See also [ggbot2-codecommit-readonly-policy on IAM](./iam-roles.md)
