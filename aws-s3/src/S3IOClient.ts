import * as stream from "node:stream"

import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	ListObjectsV2CommandInput,
	ListObjectsV2CommandOutput,
	PutObjectCommand,
	S3Client,
	S3ServiceException
} from "@aws-sdk/client-s3"

import { s3Client } from "./client.js"
import { s3ServiceExceptionName } from "./errors.js"
import { S3BucketProvider, S3Path } from "./types.js"

const streamToString = (stream: NodeJS.ReadableStream): Promise<string> => new Promise((resolve, reject) => {
	const chunks: Uint8Array[] = []
	stream.on("data", (chunk) => chunks.push(chunk as Uint8Array))
	stream.on("error", reject)
	stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
})

type ListObjectsOutput = Pick<
	ListObjectsV2CommandOutput,
	"Contents" | "CommonPrefixes"
>

export class S3IOClient implements S3BucketProvider {
	readonly client: S3Client
	readonly Bucket: string
	readonly region: string

	constructor(region: S3IOClient["region"], Bucket: S3IOClient["Bucket"]) {
		this.client = s3Client(region)
		this.Bucket = Bucket
		this.region = region
	}

	async getObject(Key: S3Path["Key"]) {
		try {
			const command = new GetObjectCommand({ Bucket: this.Bucket, Key })
			const output = await this.client.send(command)
			const body = output?.Body
			if (!(body instanceof stream.Readable)) return null
			return await streamToString(body)
		} catch (error) {
			if (error instanceof S3ServiceException) {
				if (error.name === s3ServiceExceptionName.NoSuchKey) return null
			}
			throw error
		}
	}

	async listObjects({
		ContinuationToken,
		Contents: previousContents = [],
		CommonPrefixes: previousCommonPrefixes = [],
		...params
	}: ListObjectsOutput &
		Pick<
			ListObjectsV2CommandInput,
			| "ContinuationToken"
			| "Delimiter"
			| "MaxKeys"
			| "Prefix"
			| "StartAfter"
		>): Promise<ListObjectsOutput> {
		const command = new ListObjectsV2Command({
			Bucket: this.Bucket,
			ContinuationToken,
			...params
		})
		const {
			CommonPrefixes: CurrentCommonPrefixes = [],
			Contents: CurrentContents = [],
			IsTruncated,
			NextContinuationToken
		} = await this.client.send(command)

		const CommonPrefixes = previousCommonPrefixes.concat(
			CurrentCommonPrefixes
		)
		const Contents = previousContents.concat(CurrentContents)

		if (!IsTruncated) return { Contents, CommonPrefixes }

		const { Contents: nextContents, CommonPrefixes: nextCommonPrefixes } =
			await this.listObjects({
				CommonPrefixes,
				Contents,
				ContinuationToken: NextContinuationToken
			})
		return { Contents: nextContents, CommonPrefixes: nextCommonPrefixes }
	}

	async putObject(Key: S3Path["Key"], data: string) {
		const Body = Buffer.from(data)
		const command = new PutObjectCommand({ Body, Bucket: this.Bucket, Key })
		return await this.client.send(command)
	}

	async deleteObject(Key: S3Path["Key"]) {
		const command = new DeleteObjectCommand({ Bucket: this.Bucket, Key })
		return await this.client.send(command)
	}
}
