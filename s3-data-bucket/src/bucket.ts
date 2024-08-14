import { DocumentProviderLevel3, DocumentProviderListItemsInput } from "@workspace/api"
import { S3Bucket, S3IOClient } from "@workspace/aws-s3"
import { AwsRegion } from "@workspace/aws-types"
import { deletedNow, DeployStage, SerializableData, updatedNow } from "@workspace/models"

const nextDeployStage: DeployStage = "next"

export function getS3DataBucketName (deployStage: DeployStage, dnsDomain: string, awsRegion: AwsRegion): S3Bucket["name"] {
	return deployStage === "local"
		? `${nextDeployStage}-data.${awsRegion}.${dnsDomain}`
		: `${deployStage}-data.${awsRegion}.${dnsDomain}`
}

export class S3DataBucketProvider implements DocumentProviderLevel3 {
	private s3: S3IOClient

	constructor(awsRegion: AwsRegion, bucketName: string) {
		this.s3 = new S3IOClient(awsRegion, bucketName)
	}

	async getItem<Data extends SerializableData>(key: string) {
		const json = await this.s3.getObject(key)
		if (!json) return null
		const data: unknown = JSON.parse(json)
		return data as Data
	}

	async removeItem(key: string) {
		await this.s3.deleteObject(key)
		return deletedNow()
	}

	async setItem(key: string, data: SerializableData) {
		await this.s3.putObject(key, JSON.stringify(data))
		return updatedNow()
	}

	async listItems({ prefix, token, numItems }: DocumentProviderListItemsInput) {
		const {
			Contents, NextContinuationToken,
		} = await this.s3.listObjects({ Prefix: prefix, ContinuationToken: token, MaxKeys: numItems })
		return {
			keys: Contents?.reduce<string[]>((list, { Key }) => (Key ? list.concat(Key) : list), []) ?? [],
			nextToken: NextContinuationToken,
		}
	}
}
