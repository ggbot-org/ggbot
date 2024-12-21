import { deletedNow, updatedNow } from '@workspace/models'

import { S3IOClient } from './S3IOClient.js'

/** @typedef {import('@workspace/api').DocumentProviderLevel3} DocumentProviderLevel3 */

/** @type {import('./bucket').getS3DataBucketName} */
export function getS3DataBucketName(deployStage, dnsDomain, awsRegion) {
	return deployStage == 'local'
		? `next-data.${awsRegion}.${dnsDomain}`
		: `${deployStage}-data.${awsRegion}.${dnsDomain}`
}

/** @implements {DocumentProviderLevel3} */
export class S3DataBucketProvider {
	/**
	 * @param {string} awsRegion
	 * @param {string} bucketName
	 */
	constructor(awsRegion, bucketName) {
		this.s3 = new S3IOClient(awsRegion, bucketName)
	}

/** @type {import('./bucket').S3DataBucketProvider['getItem']} */
	async getItem(key) {
		const json = await this.s3.getObject(key)
		if (!json) return null
		return JSON.parse(json)
	}

/** @type {import('./bucket').S3DataBucketProvider['removeItem']} */
	async removeItem(key) {
		await this.s3.deleteObject(key)
		return deletedNow()
	}

/** @type {import('./bucket').S3DataBucketProvider['setItem']} */
	async setItem(key, data) {
		await this.s3.putObject(key, JSON.stringify(data))
		return updatedNow()
	}

/** @type {import('./bucket').S3DataBucketProvider['listItems']} */
	async listItems({ prefix, token, numItems }) {
		const { Contents, NextContinuationToken } = await this.s3.listObjects({
			Prefix: prefix,
			ContinuationToken: token,
			MaxKeys: numItems,
		})
		return {
			keys: Contents?.reduce(
				(list, { Key }) => (Key ? list.concat(Key) : list),
				/** @type {string[]} */ ([])
			) ?? [],
			nextToken: NextContinuationToken,
		}
	}
}
