import { awsRegion } from "./awsRegions.js"
import { fqdn } from "./fqdn.js"
import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export class Webapp {
	s3Bucket = new StaticWebsiteBucket(awsRegion, fqdn.webappDomain)
}
