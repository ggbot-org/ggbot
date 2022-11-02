# ggbot2 development

## Rules

1. Use lowercase strings everywhere, unless it makes sense to use an uppercase letter.
2. Stay minimal, less is more.

## Requirements

### Node.js

With [NVM](https://github.com/nvm-sh/nvm) do

```sh
nvm use
```

to use [Node.js](https://nodejs.org/it/) version specified in *.nvmrc* file.

See also how to [call `nvm use` automatically in a directory with a *.nvmrc* file](https://github.com/nvm-sh/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file).

### npm

Package manager used is *npm*.

### Environment variables

Use [direnv](https://direnv.net/) to load variables from *.envrc* file.

See also [`env` workspace](./env).

## Repo structure

Repository structure and conventions are tested by `npm run repo_tests`, implemented [here](./repo/tests.js).
See also [internal npm workspaces documentation](./docs/workspaces.md).

## Dependencies

Check deps: `npm outdated`
Update deps: `npm update`

Notice that npm updates to *minor* versions. It is a good idea to not automate *major* upgrades.

## DevOps

Check platform status: `npm run task:status`.

See also [`devops` workspace](./devops).
