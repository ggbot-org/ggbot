# ggbot2 Tech stack

- [Git](#git)
- [Markdown](#markdown)
- [AWS Command Line Interface](#aws-command-line-interface)
- Amazon Web Services
  - [AWS Certificate Manager](#aws-certificate-manager)
  - [AWS CloudFront](#aws-cloudfront)
  - [AWS CodeCommit](#aws-codecommit)
  - [AWS EC2](#aws-ec2)
  - [AWS IAM](#aws-iam)
  - [AWS S3](#aws-s3)
- [Google Search Console](google-search-console)
- [Node.js](#nodejs)
- [npm workspaces](#npm-workspaces)
- [NVM](#nvm)
- [React](#react)
- Utrust
- npm packages
  - [@types/node](#typesnode)
  - [@typescript-eslint/eslint-plugin](#typescript-eslinteslint-plugin)
  - [@typescript-eslint/parser](#typescript-eslintparser)
  - [@utrustdev/utrust-ts-library](utrustdevutrust-ts-library)
  - [aws-sdk](#aws-sdk)
  - [country-isocode2](#country-isocode2)
  - [eslint](#eslint)
  - [eslint-plugin-import](#eslint-plugin-import)
  - [eslint-plugin-jsx-a11y](#eslint-plugin-jsx-a11y)
  - [eslint-plugin-react](#eslint-plugin-react)
  - [eslint-plugin-react-hooks](#eslint-plugin-react-hooks)
  - [dflow](#dflow)
  - [flow-view](#flow-view)
  - [npm-run-all](#npm-run-all)
  - [typescript](#typescript)

## Git

> Git is a free and open source distributed version control system

https://git-scm.com/

## Markdown

> Markdown is a lightweight markup language for creating formatted text using a plain-text editor.

https://en.wikipedia.org/wiki/Markdown

## AWS Command Line Interface

https://aws.amazon.com/cli/

## Amazon Web Services

### AWS Certificate Manager

https://aws.amazon.com/certificate-manager/

### AWS CloudFront

https://aws.amazon.com/cloudfront/

### AWS CodeCommit

https://aws.amazon.com/codecommit/

### AWS EC2

https://aws.amazon.com/ec2/

See also how to create [EC2 base AMI](./ec2-base-ami.md).

### AWS IAM

https://aws.amazon.com/iam/

### AWS S3

https://aws.amazon.com/s3/

## Google Search Console

Created the following properties:

- [ggbot2.com and www.ggbot2.com](https://search.google.com/search-console?resource_id=sc-domain%3Aggbot2.com)
- [app.ggbot2.com](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aapp.ggbot2.com)

## Node.js

https://nodejs.org/it/

To install Node.js locally, use [NVM](#nvm).

Package manager used is _npm_.

Node is also used for tests, with `node:test` module: see [Node Test runner documentation](https://nodejs.org/api/test.html).

Current Node.js version used on AWS AMI is `v18.2.1`.
Local Node.js version used for development is `>20` cause it is using latest Node TestRunner.

Node version currently

## npm workspaces

https://docs.npmjs.com/cli/v7/using-npm/workspaces

See also [npm workspaces internal documentation](./npm-workspaces.md).

## NVM

> Node Version Manager - POSIX-compliant bash script to manage multiple active node.js versions

https://github.com/nvm-sh/nvm

NVM configuration file is _.nvmrc_ and it is located in repository root folder.

To install [Node.js](#nodejs) locally, go to repository root folder and launch:

```sh
nvm use
```

See also how to [call `nvm use` automatically in a directory with a _.nvmrc_ file](https://github.com/nvm-sh/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file).

## React

> The library for web and native user interfaces

https://react.dev/

## npm packages

### @types/node

https://www.npmjs.com/package/@types/node

### @typescript-eslint/eslint-plugin

https://www.npmjs.com/package/@typescript-eslint/eslint-plugin

### @typescript-eslint/parser

https://www.npmjs.com/package/@typescript-eslint/parser

### @utrustdev/utrust-ts-library

https://www.npmjs.com/package/@utrustdev/utrust-ts-library

### aws-sdk

https://www.npmjs.com/package/aws-sdk

### country-isocode2

https://www.npmjs.com/package/country-isocode2

### dflow

https://www.npmjs.com/package/dflow

### eslint

https://www.npmjs.com/package/eslint

### eslint-plugin-import

https://www.npmjs.com/package eslint-plugin-import

### eslint-plugin-jsx-a11y

https://www.npmjs.com/package eslint-plugin-jsx-a11y

### eslint-plugin-react

https://www.npmjs.com/package/eslint-plugin-react

### eslint-plugin-react-hooks

https://www.npmjs.com/package/eslint-plugin-react-hooks

### flow-view

https://www.npmjs.com/package/flow-view

### npm-run-all

https://www.npmjs.com/package/npm-run-all

### pre-commit

https://www.npmjs.com/package/pre-commit

### typescript

https://www.npmjs.com/package/typescript
