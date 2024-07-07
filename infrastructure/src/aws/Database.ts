import { databaseWorkspace, Workspace } from "@workspace/repository"

import { DataBucket } from "./DataBucket.js"

export class Database {
	readonly s3Bucket: DataBucket = new DataBucket()
	readonly workspace: Workspace = databaseWorkspace

	async read() {
		await this.workspace.read()
	}
}
