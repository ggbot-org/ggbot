import {
	DocumentProviderLevel3,
	DocumentProviderListItemsInput,
} from '@workspace/api'
import { DeployStage } from '@workspace/env'
import { deletedNow, SerializableData, updatedNow } from '@workspace/models'

import { S3IOClient } from './S3IOClient.js'

export function getS3DataBucketName(
	deployStage: DeployStage,
	dnsDomain: string,
	awsRegion: string
): string {
	return deployStage == 'local'
		? `${'next' satisfies DeployStage}-data.${awsRegion}.${dnsDomain}`
		: `${deployStage}-data.${awsRegion}.${dnsDomain}`
}

export class S3DataBucketProvider implements DocumentProviderLevel3 {
	s3: S3IOClient

	constructor(awsRegion: string, bucketName: string) {
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
		const { Contents, NextContinuationToken } = await this.s3.listObjects({
			Prefix: prefix,
			ContinuationToken: token,
			MaxKeys: numItems,
		})
		return {
			keys:
				Contents?.reduce<string[]>(
					(list, { Key }) => (Key ? list.concat(Key) : list),
					[]
				) ?? [],
			nextToken: NextContinuationToken,
		}
	}
}
