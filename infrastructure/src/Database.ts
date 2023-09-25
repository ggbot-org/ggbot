import { getDataBucketName } from "@workspace/database"
import { ENV } from "@workspace/env"
import { databaseWorkspace, Workspace } from "@workspace/repository"

import { DataBucket } from "./DataBucket.js"

export class Database {
	s3Bucket: DataBucket
	workspace: Workspace
	constructor(deployStage = ENV.DEPLOY_STAGE()) {
		this.s3Bucket = new DataBucket(
			ENV.AWS_DATA_REGION(),
			getDataBucketName(deployStage)
		)
		this.workspace = databaseWorkspace
	}
	async read() {
		await this.workspace.read()
	}
}
