import { ENV } from "@workspace/env"
import { FQDN } from "@workspace/locators"
import { webappWorkspace } from "@workspace/repository"

import { staticWebsiteAwsRegion } from "../awsRegions.js"
import { fqdn } from "./fqdn.js"
import { StaticWebsite } from "./StaticWebsite.js"
import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export class Webapp implements StaticWebsite {
	readonly s3Bucket = new StaticWebsiteBucket(
		staticWebsiteAwsRegion,
		fqdn.webappDomain
	)
	readonly workspace = webappWorkspace
	constructor(deployStage = ENV.DEPLOY_STAGE()) {
		this.s3Bucket = new StaticWebsiteBucket(
			staticWebsiteAwsRegion,
			FQDN.webappDomain(deployStage, ENV.DNS_DOMAIN())
		)
		this.workspace = webappWorkspace
	}
}
