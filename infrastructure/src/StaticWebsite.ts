import { Workspace } from "@workspace/repository"

import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

export type StaticWebsite = {
	s3Bucket: StaticWebsiteBucket
	workspace: Workspace
	read: Promise<void>
}
