# ggbot2 code on AWS CodeCommit

<!-- TODO remove this -->

Repo here: https://eu-central-1.console.aws.amazon.com/codesuite/codecommit/repositories/ggbot2-monorepo/browse?region=eu-central-1

Create local ssh key, for instance _~/.ssh/aws_codecommit_rsa_.

Edit _~/.ssh/config_, add

    Host git-codecommit.*.amazonaws.com
      User APKA123ABCDEFGHIJKLM
      IdentityFile ~/.ssh/aws_codecommit_rsa

Where `User APKA123ABCDEFGHIJKLM` comes from AWS user (?? TODO document it properly)

Add git remote to local repository

```sh
git remote add aws_codecommit ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/ggbot2-monorepo
```

Done that, to update CodeCommit launch

```sh
git push aws_codecommit main
```
