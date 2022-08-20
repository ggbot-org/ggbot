import { BucketCannedACL } from "@aws-sdk/client-s3";
import { getDeployStage } from "@ggbot2/env";
import { assetsDomain, domainName, wwwDomain } from "./domainNames.js";

const defaultDeployStage = getDeployStage();

export const getAssetsDomainBucketName = () => assetsDomain;

export const getAssetsDomainBucketArn = () =>
  `arn:aws:s3:::${getAssetsDomainBucketName()}`;

export const assetsDomainBucketACL: BucketCannedACL = "public-read";

export const getDataBucketName = (deployStage = defaultDeployStage) =>
  `${deployStage}-data.${domainName}`;

export const getDataBucketArn = (deployStage = defaultDeployStage) =>
  `arn:aws:s3:::${getDataBucketName(deployStage)}`;

export const dataBucketACL: BucketCannedACL = "private";

export const getLogsBucketName = (deployStage = defaultDeployStage) =>
  `${deployStage}-logs.${domainName}`;

export const getLogsBucketArn = (deployStage = defaultDeployStage) =>
  `arn:aws:s3:::${getLogsBucketName(deployStage)}`;

export const logsBucketACL: BucketCannedACL = "private";

export const getNakedDomainBucketName = () => domainName;

export const getNakedDomainBucketArn = () =>
  `arn:aws:s3:::${getNakedDomainBucketName()}`;

export const nakedDomainBucketACL: BucketCannedACL = "public-read";

export const getWwwDomainBucketName = () => wwwDomain;

export const getWwwDomainBucketArn = () =>
  `arn:aws:s3:::${getWwwDomainBucketName()}`;

export const wwwDomainBucketACL: BucketCannedACL = "public-read";
