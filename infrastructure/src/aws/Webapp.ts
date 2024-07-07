import { webappWorkspace } from "@workspace/repository"

import { StaticWebsite } from "./StaticWebsite.js"
import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export class Webapp implements StaticWebsite {
	readonly s3Bucket = new StaticWebsiteBucket()
	readonly workspace = webappWorkspace
}
