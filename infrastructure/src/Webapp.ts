import { fqdn } from "./fqdn.js"
import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export class Webapp {
	s3Bucket = new StaticWebsiteBucket(fqdn.webappDomain)
}
