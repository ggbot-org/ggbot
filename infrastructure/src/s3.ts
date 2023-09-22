import { S3BucketACL } from "@workspace/aws"
import { getDataBucketName } from "@workspace/database"
import { ENV } from "@workspace/env"
import { FQDN } from "@workspace/locators"

const { DEPLOY_STAGE } = ENV
const DNS_DOMAIN = ENV.DNS_DOMAIN()

export const appBucketACL: S3BucketACL = "public-read"

export const getDataBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getDataBucketName(deployStage)}`

export const dataBucketACL: S3BucketACL = "private"

// TODO
// export const getLogsBucketName = (deployStage = DEPLOY_STAGE()) =>
// 	`${deployStage}-logs.${awsRegion}.${DNS_DOMAIN}`

// TODO
// export const getLogsBucketArn = (deployStage = DEPLOY_STAGE()) =>
// 	`arn:aws:s3:::${getLogsBucketName(deployStage)}`
// export const logsBucketACL = BucketCannedACL.private

export const getNakedDomainBucketName = () => DNS_DOMAIN

export const getNakedDomainBucketArn = () =>
	`arn:aws:s3:::${getNakedDomainBucketName()}`

export const nakedDomainBucketACL: S3BucketACL = "public-read"

export const getWebappBucketName = (deployStage = DEPLOY_STAGE()) =>
	new FQDN(deployStage, DNS_DOMAIN).webappDomain

export const getWebappBucketArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:s3:::${getWebappBucketName(deployStage)}`

export const webappBucketACL: S3BucketACL = "public-read"
