import { S3IOClient } from "@workspace/aws-s3"
import { AwsRegion } from "@workspace/aws-types"
import {
	DeletionTime,
	DocumentProviderLevel2,
	SerializableData,
	UpdateTime,
	deletedNow,
	updatedNow
} from "@workspace/models"

export class S3DataBucketProvider implements DocumentProviderLevel2 {
	private s3: S3IOClient

	constructor(awsRegion: AwsRegion, bucketName: string) {
		this.s3 = new S3IOClient(awsRegion, bucketName)
	}

	async getItem<Data extends SerializableData>(
		key: string
	): Promise<Data | null> {
		const json = await this.s3.getObject(key)
		if (!json) return null
		const data: unknown = JSON.parse(json)
		return data as Data
	}

	async removeItem(key: string): Promise<DeletionTime> {
		await this.s3.deleteObject(key)
		return deletedNow()
	}

	async setItem(key: string, value: SerializableData): Promise<UpdateTime> {
		await this.s3.putObject(key, JSON.stringify(value))
		return updatedNow()
	}
}
