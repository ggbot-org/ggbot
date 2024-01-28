import { databaseWorkspace, Workspace } from "@workspace/repository"

import { DataBucket } from "./DataBucket.js"

export class Database {
	s3Bucket: DataBucket
	workspace: Workspace
	constructor() {
		this.s3Bucket = new DataBucket()
		this.workspace = databaseWorkspace
	}
	async read() {
		await this.workspace.read()
	}
}
