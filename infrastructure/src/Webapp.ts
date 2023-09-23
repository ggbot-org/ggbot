import { webappWorkspace } from "@workspace/repository"

import { staticWebsiteAwsRegion } from "./awsRegions.js"
import { fqdn } from "./fqdn.js"
import { StaticWebsite } from "./StaticWebsite.js"
import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export class Webapp implements StaticWebsite {
	s3Bucket = new StaticWebsiteBucket(
		staticWebsiteAwsRegion,
		fqdn.webappDomain
	)
	workspace = webappWorkspace
	async read() {
		await this.workspace.read()
	}
}
