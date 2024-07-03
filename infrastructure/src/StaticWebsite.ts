import { Workspace } from "@workspace/repository"

import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export type StaticWebsite = {
	readonly s3Bucket: StaticWebsiteBucket
	readonly workspace: Workspace
}
