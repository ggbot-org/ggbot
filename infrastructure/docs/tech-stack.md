# ggbot2 Tech stack

-   [Git](#git)
-   [Markdown](#markdown)
-   [AWS Command Line Interface](#aws-command-line-interface)
-   Amazon Web Services
    -   [AWS Certificate Manager](#aws-certificate-manager)
    -   [AWS CloudFront](#aws-cloudfront)
    -   [AWS EC2](#aws-ec2)
    -   [AWS IAM](#aws-iam)
    -   [AWS S3](#aws-s3)
-   [direnv](#direnv)
-   [Google Search Console](#google-search-console)
-   [Node.js](#nodejs)
-   [npm workspaces](#npm-workspaces)
-   [NVM](#nvm)
-   [React](#react)
-   [Stripe](#stripe)
-   npm packages
    -   [@types/node](#typesnode)
    -   [@typescript-eslint/eslint-plugin](#typescript-eslinteslint-plugin)
    -   [@typescript-eslint/parser](#typescript-eslintparser)
    -   [aws-sdk](#aws-sdk)
    -   [eslint](#eslint)
    -   [eslint-plugin-import](#eslint-plugin-import)
    -   [eslint-plugin-jsx-a11y](#eslint-plugin-jsx-a11y)
    -   [eslint-plugin-react](#eslint-plugin-react)
    -   [eslint-plugin-react-hooks](#eslint-plugin-react-hooks)
    -   [dflow](#dflow)
    -   [flow-view](#flow-view)
    -   [ts-prune](#ts-prune)
    -   [typescript](#typescript)

## Git

> Git is a free and open source distributed version control system

https://git-scm.com/

## Markdown

> Markdown is a lightweight markup language for creating formatted text using a plain-text editor.

https://en.wikipedia.org/wiki/Markdown

## AWS Command Line Interface

> The AWS Command Line Interface (AWS CLI) is a unified tool to manage your AWS services.

Easiest way to install it on MacOS is to use [awscli Homebrew Formula](https://formulae.brew.sh/formula/awscli)

```sh
brew install awscli
```

-   [AWS CLI Homepage](https://aws.amazon.com/cli/)
-   [Get started with the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

## Amazon Web Services

### AWS Certificate Manager

https://aws.amazon.com/certificate-manager/

### AWS CloudFront

https://aws.amazon.com/cloudfront/

### AWS EC2

https://aws.amazon.com/ec2/

See also how to create [EC2 base AMI](./ec2-base-ami.md).

### AWS IAM

https://aws.amazon.com/iam/

### AWS S3

https://aws.amazon.com/s3/

## direnv

https://direnv.net/

`direnv` is an extension for your shell. It augments existing shells with a new feature that can load and unload environment variables depending on the current directory.

## Google Search Console

Created the following properties:

-   [ggbot2.com and www.ggbot2.com](https://search.google.com/search-console?resource_id=sc-domain%3Aggbot2.com)
-   [app.ggbot2.com](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aapp.ggbot2.com)

## Node.js

https://nodejs.org/it/

To install Node.js locally, use [NVM](#nvm).

Package manager used is _npm_.

To install dependencies for development, launch

```sh
npm ci --include=optional
```

Node is also used for tests, with `node:test` module: see [Node Test runner documentation](https://nodejs.org/api/test.html).

## npm workspaces

https://docs.npmjs.com/cli/using-npm/workspaces

See also [npm workspaces internal documentation](../../repository/docs/npm-workspaces.md).

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

## Stripe

> Payments infrastructure for the internet

https://stripe.com/

## npm packages

### @types/node

https://www.npmjs.com/package/@types/node

### @typescript-eslint/eslint-plugin

https://www.npmjs.com/package/@typescript-eslint/eslint-plugin

### @typescript-eslint/parser

https://www.npmjs.com/package/@typescript-eslint/parser

### aws-sdk

https://www.npmjs.com/package/aws-sdk

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

### pre-commit

https://www.npmjs.com/package/pre-commit

### ts-prune

https://www.npmjs.com/package/ts-prune

### typescript

https://www.npmjs.com/package/typescript
