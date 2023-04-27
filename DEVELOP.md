# ggbot2 development

## Principles

1. Use lowercase strings everywhere, unless it makes sense to use an uppercase letter.
2. Stay minimal, less is more.

## Requirements

See [Node.js](./docs/tech-stack.md#nodejs) section in _Tech stack_ documentation.

### Environment variables

Use [direnv](https://direnv.net/) to load variables from _.envrc_ file.
In the repo root dir, to be able to start development, create a _.envrc_ file like the following

```sh
export AWS_ACCOUNT_ID=123
export AWS_ACCESS_KEY_ID=XXX
export AWS_SECRET_ACCESS_KEY=XXX
```

See also [`env` workspace](./env).

## Repo structure

Repository structure and conventions are tested by `npm run repo_tests`, implemented [here](./repo/tests.js).
See also [internal npm workspaces documentation](./docs/workspaces.md).

## Dependencies

Check deps: `npm outdated`
Update deps: `npm update`

Notice that npm updates to _minor_ versions. It is a good idea to not automate _major_ upgrades.

## DevOps

Check platform status: `npm run task:status`.

See also [`devops` workspace](./devops).
