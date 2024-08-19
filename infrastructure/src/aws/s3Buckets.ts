import { S3Bucket } from "@workspace/aws-s3"
import { ENV } from "@workspace/env"
import { FQDN } from "@workspace/locators"
import { DeployStage } from "@workspace/models"
import { getS3DataBucketName } from "@workspace/s3-data-bucket"

const AWS_REGION = ENV.AWS_DATA_REGION()
const DNS_DOMAIN = ENV.DNS_DOMAIN()

export class DataBucket extends S3Bucket {
	constructor(deployStage: DeployStage) {
		super(AWS_REGION, getS3DataBucketName(deployStage, DNS_DOMAIN, AWS_REGION))
	}
}

export class WebappBucket extends S3Bucket {
	constructor(deployStage: DeployStage) {
		super(AWS_REGION, new FQDN(deployStage, ENV.DNS_DOMAIN()).webappDomain)
	}
}
