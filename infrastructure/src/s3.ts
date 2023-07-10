import { BucketCannedACL } from "@aws-sdk/client-s3";
import { ENV } from "@ggbot2/env";
import {
  appDomain,
  appNextDomain,
  assetsDomain,
  topLevelDomain,
  wwwDomain,
} from "@ggbot2/locators";

import { awsRegion } from "./awsRegions.js";

const { DEPLOY_STAGE } = ENV;

export const getAppBucketName = (deployStage = DEPLOY_STAGE) =>
  ["local", "next"].includes(deployStage) ? appNextDomain : appDomain;

export const getAppBucketArn = (deployStage = DEPLOY_STAGE) =>
  `arn:aws:s3:::${getAppBucketName(deployStage)}`;

export const appBucketACL = BucketCannedACL.public_read;

export const getAssetsBucketName = () => assetsDomain;

export const getAssetsBucketArn = () => `arn:aws:s3:::${getAssetsBucketName()}`;

export const assetsBucketACL = BucketCannedACL.public_read;

export const getDataBucketName = (deployStage = DEPLOY_STAGE) =>
  deployStage === "local"
    ? `next-data.${awsRegion}.${topLevelDomain}`
    : `${deployStage}-data.${awsRegion}.${topLevelDomain}`;

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

export const getWwwBucketName = () => wwwDomain;

export const getWwwBucketArn = () => `arn:aws:s3:::${getWwwBucketName()}`;

export const wwwBucketACL = BucketCannedACL.public_read;
