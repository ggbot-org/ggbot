# ggbot2 Tech stack

- Amazon Web Services
  - [AWS Certificate Manager](#aws-certificate-manager)
  - [AWS CloudFront](#aws-cloudfront)
  - [AWS CodeCommit](#aws-codecommit)
  - [AWS EC2](#aws-ec2)
  - [AWS IAM](#aws-iam)
  - [AWS S3](#aws-s3)
- [Git](#git)
- [Google Search Console](google-search-console)
- [Node.js](#nodejs)
- npm workspaces
- [nvm](#nvm)
- Utrust
- npm packages
  - aws-sdk
  - country-isocode2
  - dflow
  - flow-view

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

## Git

> Git is a free and open source distributed version control system

https://git-scm.com/

## Google Search Console

Created the following properties:

- [ggbot2.com and www.ggbot2.com](https://search.google.com/search-console?resource_id=sc-domain%3Aggbot2.com)
- [app.ggbot2.com](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aapp.ggbot2.com)

## Node.js

https://nodejs.org/it/

To install Node.js locally, use [NVM](#nvm).

Package manager used is *npm*.

## npm workspaces

https://docs.npmjs.com/cli/v7/using-npm/workspaces

See also [npm workspaces internal documentation](./npm-workspaces.md).

## NVM

> Node Version Manager - POSIX-compliant bash script to manage multiple active node.js versions

https://github.com/nvm-sh/nvm

NVM configuration file is *.nvmrc* and it is located in repository root folder.

To install [Node.js](#nodejs) locally,  go to repository root folder and launch:

```sh
nvm use
```

See also how to [call `nvm use` automatically in a directory with a *.nvmrc* file](https://github.com/nvm-sh/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file).

## npm packages

### aws-sdk

https://www.npmjs.com/package/aws-sdk

### country-isocode2

https://www.npmjs.com/package/country-isocode2

### dflow

https://www.npmjs.com/package/dflow

### flow-view

https://www.npmjs.com/package/flow-view

