import { BucketCannedACL } from "@workspace/aws"
import { ENV } from "@workspace/env"
import { FQDN } from "@workspace/locators"

import { awsRegion } from "./awsRegions.js"

const { DEPLOY_STAGE } = ENV
const DNS_DOMAIN = ENV.DNS_DOMAIN()

export const appBucketACL = BucketCannedACL.public_read

export const getDataBucketName = (deployStage = DEPLOY_STAGE()) =>
	deployStage === "local"
		? `next-data.${awsRegion}.${DNS_DOMAIN}`
		: `${deployStage}-data.${awsRegion}.${DNS_DOMAIN}`

export const getDataBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getDataBucketName(deployStage)}`

export const dataBucketACL = BucketCannedACL.private

export const getLogsBucketName = (deployStage = DEPLOY_STAGE()) =>
	`${deployStage}-logs.${awsRegion}.${DNS_DOMAIN}`

export const getLogsBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getLogsBucketName(deployStage)}`

export const logsBucketACL = BucketCannedACL.private

export const getNakedDomainBucketName = () => DNS_DOMAIN

export const getNakedDomainBucketArn = () =>
	`arn:aws:s3:::${getNakedDomainBucketName()}`

export const nakedDomainBucketACL = BucketCannedACL.public_read

export const getWebappBucketName = (deployStage = DEPLOY_STAGE()) =>
	new FQDN(deployStage, DNS_DOMAIN).webappDomain

export const getWebappBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getWebappBucketName(deployStage)}`

export const webappBucketACL = BucketCannedACL.public_read
