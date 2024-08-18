import { S3Bucket } from "@workspace/aws-s3"
import { ENV } from "@workspace/env"
import { FQDN } from "@workspace/locators"
import { DeployStage } from "@workspace/models"

export class StaticWebsiteBucket extends S3Bucket {
	constructor(deployState: DeployStage) {
		super(ENV.AWS_DATA_REGION(), new FQDN(deployState, ENV.DNS_DOMAIN()).webappDomain)
	}
}
