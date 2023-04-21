import { BucketCannedACL } from "@aws-sdk/client-s3";
import {
  assetsDomain,
  topLevelDomain,
  designDomain,
  wwwDomain,
} from "@ggbot2/locators";
import { ENV } from "@ggbot2/env";
import { awsRegion } from "./awsRegion.js";

const { DEPLOY_STAGE } = ENV;

export const getAssetsBucketName = () => assetsDomain;

export const getAssetsBucketArn = () => `arn:aws:s3:::${getAssetsBucketName()}`;

export const assetsBucketACL = BucketCannedACL.public_read;

export const getDataBucketName = (deployStage = DEPLOY_STAGE) =>
  `${deployStage}-data.${awsRegion}.${topLevelDomain}`;

export const getDataBucketArn = (deployStage = DEPLOY_STAGE) =>
  `arn:aws:s3:::${getDataBucketName(deployStage)}`;

export const dataBucketACL = BucketCannedACL.private;

export const getLogsBucketName = (deployStage = DEPLOY_STAGE) =>
  `${deployStage}-logs.${awsRegion}.${topLevelDomain}`;

export const getLogsBucketArn = (deployStage = DEPLOY_STAGE) =>
  `arn:aws:s3:::${getLogsBucketName(deployStage)}`;

export const logsBucketACL = BucketCannedACL.private;

export const getNakedDomainBucketName = () => topLevelDomain;

export const getNakedDomainBucketArn = () =>
  `arn:aws:s3:::${getNakedDomainBucketName()}`;

export const nakedDomainBucketACL = BucketCannedACL.public_read;

export const getDesignBucketName = () => designDomain;

export const getDesignBucketArn = () => `arn:aws:s3:::${getDesignBucketName()}`;

export const designBucketACL = BucketCannedACL.public_read;

export const getWwwBucketName = () => wwwDomain;

export const getWwwBucketArn = () => `arn:aws:s3:::${getWwwBucketName()}`;

export const wwwBucketACL = BucketCannedACL.public_read;
