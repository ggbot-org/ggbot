import * as stream from "node:stream"

import {
	CreateBucketCommand,
	CreateBucketCommandInput,
	DeleteObjectCommand,
	GetObjectCommand,
	HeadBucketCommand,
	ListObjectsV2Command,
	ListObjectsV2CommandInput,
	ListObjectsV2CommandOutput,
	PutObjectCommand,
	S3Client,
	S3ClientConfig,
	S3ServiceException
} from "@aws-sdk/client-s3"

import { AwsClientConfigRegion } from "./region.js"

export { BucketCannedACL, S3ServiceException } from "@aws-sdk/client-s3"

export const s3ServiceExceptionName = {
	NotFound: "NotFound",
	NoSuchKey: "NoSuchKey"
}

// The `Bucket` and `Key` types are defined by @aws-sdk/client-s3 as `string | undefined`.
// Redefine them here, in our use case an undefined Bucket or Key does not make sense.
export type S3Path = {
	Bucket: string
	Key: string
}

type S3ClientArgs = AwsClientConfigRegion & Omit<S3ClientConfig, "apiVersion">

const s3Client = (args: S3ClientArgs) =>
	new S3Client({ apiVersion: "2006-03-01", ...args })

export type CreateBucketArgs = Pick<S3Path, "Bucket"> &
	Pick<CreateBucketCommandInput, "ACL"> &
	S3ClientArgs

export const createBucket = async ({
	Bucket,
	region,
	ACL
}: CreateBucketArgs): Promise<void> => {
	const command = new CreateBucketCommand({ Bucket, ACL })
	const client = s3Client({ region })
	await client.send(command)
}

const streamToString = (stream: NodeJS.ReadableStream): Promise<string> =>
	new Promise((resolve, reject) => {
		const chunks: any[] = []
		stream.on("data", (chunk) => chunks.push(chunk))
		stream.on("error", reject)
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
	})

export const getObject =
	({ Bucket, ...clientArgs }: Pick<S3Path, "Bucket"> & S3ClientArgs) =>
	async (Key: S3Path["Key"]) => {
		try {
			const command = new GetObjectCommand({ Bucket, Key })
			const client = s3Client(clientArgs)
			const output = await client.send(command)
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

export type HeadBucketArgs = Pick<S3Path, "Bucket"> & S3ClientArgs

export const headBucket = async ({ Bucket, ...clientArgs }: HeadBucketArgs) => {
	const command = new HeadBucketCommand({ Bucket })
	const client = s3Client(clientArgs)
	return await client.send(command)
}

type ListObjectsOutput = Pick<
	ListObjectsV2CommandOutput,
	"Contents" | "CommonPrefixes"
>

export const listObjects =
	({ Bucket, ...clientArgs }: Pick<S3Path, "Bucket"> & S3ClientArgs) =>
	async ({
		ContinuationToken,
		Contents: previousContents = [],
		CommonPrefixes: previousCommonPrefixes = [],
		...params
	}: Pick<
		ListObjectsV2CommandInput,
		"ContinuationToken" | "Delimiter" | "MaxKeys" | "Prefix" | "StartAfter"
	> &
		ListObjectsOutput): Promise<ListObjectsOutput> => {
		const command = new ListObjectsV2Command({
			Bucket,
			ContinuationToken,
			...params
		})
		const client = s3Client(clientArgs)
		const {
			CommonPrefixes: CurrentCommonPrefixes = [],
			Contents: CurrentContents = [],
			IsTruncated,
			NextContinuationToken
		} = await client.send(command)

		const CommonPrefixes = previousCommonPrefixes.concat(
			CurrentCommonPrefixes
		)
		const Contents = previousContents.concat(CurrentContents)

		if (!IsTruncated) return { Contents, CommonPrefixes }

		const { Contents: nextContents, CommonPrefixes: nextCommonPrefixes } =
			await listObjects({ Bucket, ...clientArgs })({
				CommonPrefixes,
				Contents,
				ContinuationToken: NextContinuationToken
			})
		return { Contents: nextContents, CommonPrefixes: nextCommonPrefixes }
	}

export const putObject =
	({ Bucket, ...clientArgs }: Pick<S3Path, "Bucket"> & S3ClientArgs) =>
	async (Key: S3Path["Key"], data: string) => {
		const Body = Buffer.from(data)
		const command = new PutObjectCommand({ Body, Bucket, Key })
		const client = s3Client(clientArgs)
		return await client.send(command)
	}

export const deleteObject =
	({ Bucket, ...clientArgs }: Pick<S3Path, "Bucket"> & S3ClientArgs) =>
	async (Key: S3Path["Key"]) => {
		const command = new DeleteObjectCommand({ Bucket, Key })
		const client = s3Client(clientArgs)
		return await client.send(command)
	}
