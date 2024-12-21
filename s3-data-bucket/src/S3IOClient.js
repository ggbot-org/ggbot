import * as stream from 'node:stream'

import { S3Client } from '@aws-sdk/client-s3'
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3ServiceException } from '@aws-sdk/client-s3'

/**
 * @param {NodeJS.ReadableStream} stream
 * @returns {Promise<string>}
 */
function streamToString(stream) {
	return new Promise((resolve, reject) => {
		/** @type Uint8Array[] */
		const chunks = []
		stream.on('data', (chunk) => chunks.push(chunk))
		stream.on('error', reject)
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
	})
}

export class S3IOClient {
	/**
	 * @param {string} region
	 * @param {string} Bucket
	 */
	constructor(region, Bucket) {
		this.client = new S3Client({ apiVersion: '2006-03-01', region })
		this.Bucket = Bucket
	}

	/** @type {import('./S3IOClient').S3IOClient['getObject']} */
	async getObject(Key) {
		try {
			const command = new GetObjectCommand({ Bucket: this.Bucket, Key })
			const output = await this.client.send(command)
			const body = output?.Body
			if (!(body instanceof stream.Readable)) return null
			return await streamToString(body)
		} catch (error) {
			if (error instanceof S3ServiceException) {
				if (error.name === 'NoSuchKey') return null
			}
			throw error
		}
	}

	/** @type {import('./S3IOClient').S3IOClient['listObjects']} */
	async listObjects(params) {
		const command = new ListObjectsV2Command({ Bucket: this.Bucket, ...params })
		const {
			Contents,
			ContinuationToken,
			IsTruncated,
			NextContinuationToken,
		} = await this.client.send(command)

		return {
			Contents,
			ContinuationToken,
			IsTruncated,
			NextContinuationToken,
		}
	}

	/** @type {import('./S3IOClient').S3IOClient['putObject']} */
	async putObject(Key, data) {
		const Body = Buffer.from(data)
		const command = new PutObjectCommand({ Body, Bucket: this.Bucket, Key })
		return await this.client.send(command)
	}

	/** @type {import('./S3IOClient').S3IOClient['deleteObject']} */
	async deleteObject(Key) {
		const command = new DeleteObjectCommand({ Bucket: this.Bucket, Key })
		return await this.client.send(command)
	}
}
