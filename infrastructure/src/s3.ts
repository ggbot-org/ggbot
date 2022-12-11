import { BucketCannedACL } from "@aws-sdk/client-s3";
import { getDeployStage } from "@ggbot2/env";
import { awsRegion } from "./awsRegion.js";
import {
  assetsDomain,
  domainName,
  designDomain,
  wwwDomain,
} from "./domainNames.js";

const defaultDeployStage = getDeployStage();

export const getAssetsBucketName = () => assetsDomain;

export const getAssetsBucketArn = () => `arn:aws:s3:::${getAssetsBucketName()}`;

export const assetsBucketACL = BucketCannedACL.public_read;

export const getDataBucketName = (deployStage = defaultDeployStage) =>
  `${deployStage}-data.${awsRegion}.${domainName}`;

export const getDataBucketArn = (deployStage = defaultDeployStage) =>
  `arn:aws:s3:::${getDataBucketName(deployStage)}`;

export const dataBucketACL = BucketCannedACL.private;

export const getLogsBucketName = (deployStage = defaultDeployStage) =>
  `${deployStage}-logs.${awsRegion}.${domainName}`;

export const getLogsBucketArn = (deployStage = defaultDeployStage) =>
  `arn:aws:s3:::${getLogsBucketName(deployStage)}`;

export const logsBucketACL = BucketCannedACL.private;

export const getNakedDomainBucketName = () => domainName;

export const getNakedDomainBucketArn = () =>
  `arn:aws:s3:::${getNakedDomainBucketName()}`;

export const nakedDomainBucketACL = BucketCannedACL.public_read;

export const getDesignBucketName = () => designDomain;

export const getDesignBucketArn = () => `arn:aws:s3:::${getDesignBucketName()}`;

export const designBucketACL = BucketCannedACL.public_read;

export const getWwwBucketName = () => wwwDomain;

export const getWwwBucketArn = () => `arn:aws:s3:::${getWwwBucketName()}`;

export const wwwBucketACL = BucketCannedACL.public_read;
