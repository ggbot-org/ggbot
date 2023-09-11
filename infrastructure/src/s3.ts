import { BucketCannedACL } from "@aws-sdk/client-s3"
import { ENV } from "@workspace/env"
import {
	assetsDomain,
	nextWebappDomain,
	topLevelDomain,
	webappDomain
} from "@workspace/locators"

import { awsRegion } from "./awsRegions.js"

const { DEPLOY_STAGE } = ENV

export const appBucketACL = BucketCannedACL.public_read

export const getAssetsBucketName = () => assetsDomain

export const getAssetsBucketArn = () => `arn:aws:s3:::${getAssetsBucketName()}`

export const assetsBucketACL = BucketCannedACL.public_read

export const getDataBucketName = (deployStage = DEPLOY_STAGE()) =>
	deployStage === "local"
		? `next-data.${awsRegion}.${topLevelDomain}`
		: `${deployStage}-data.${awsRegion}.${topLevelDomain}`

export const getDataBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getDataBucketName(deployStage)}`

export const dataBucketACL = BucketCannedACL.private

export const getLogsBucketName = (deployStage = DEPLOY_STAGE()) =>
	`${deployStage}-logs.${awsRegion}.${topLevelDomain}`

export const getLogsBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getLogsBucketName(deployStage)}`

export const logsBucketACL = BucketCannedACL.private

export const getNakedDomainBucketName = () => topLevelDomain

export const getNakedDomainBucketArn = () =>
	`arn:aws:s3:::${getNakedDomainBucketName()}`

export const nakedDomainBucketACL = BucketCannedACL.public_read

export const getWebappBucketName = (deployStage = DEPLOY_STAGE()) =>
	["local", "next"].includes(deployStage) ? nextWebappDomain : webappDomain

export const getWebappBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getWebappBucketName(deployStage)}`

export const webappBucketACL = BucketCannedACL.public_read
