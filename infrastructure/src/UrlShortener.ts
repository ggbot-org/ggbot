import { urlShortenerWorkspace } from "@workspace/repository"

import { staticWebsiteAwsRegion } from "./awsRegions.js"
import { fqdn } from "./fqdn.js"
import { StaticWebsite } from "./StaticWebsite.js"
import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export class UrlShortener implements StaticWebsite {
	s3Bucket = new StaticWebsiteBucket(
		staticWebsiteAwsRegion,
		fqdn.webappDomain
	)
	workspace = urlShortenerWorkspace
	async read() {
		await this.workspace.read()
	}
}
