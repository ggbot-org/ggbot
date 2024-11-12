import * as stream from 'node:stream'

import { S3Client } from '@aws-sdk/client-s3'
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, ListObjectsV2CommandInput, ListObjectsV2CommandOutput, PutObjectCommand, S3ServiceException } from '@aws-sdk/client-s3'

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = []
		stream.on('data', (chunk) => chunks.push(chunk as Uint8Array))
		stream.on('error', reject)
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
	})
}

export class S3IOClient {
	client: S3Client
	Bucket: string
	region: string

	constructor(region: string, Bucket: string) {
		this.client = new S3Client({ apiVersion: '2006-03-01', region })
		this.Bucket = Bucket
		this.region = region
	}

	async getObject(Key: string) {
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

	async listObjects(params: Pick<ListObjectsV2CommandInput,
		| 'ContinuationToken'
		| 'Delimiter'
		| 'MaxKeys'
		| 'Prefix'
	>): Promise<Pick<ListObjectsV2CommandOutput,
		| 'Contents'
		| 'ContinuationToken'
		| 'NextContinuationToken'
		| 'IsTruncated'>
		> {
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

	async putObject(Key: string, data: string) {
		const Body = Buffer.from(data)
		const command = new PutObjectCommand({ Body, Bucket: this.Bucket, Key })
		return await this.client.send(command)
	}

	async deleteObject(Key: string) {
		const command = new DeleteObjectCommand({ Bucket: this.Bucket, Key })
		return await this.client.send(command)
	}
}
