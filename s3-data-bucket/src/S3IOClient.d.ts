import { ListObjectsV2CommandInput, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3'

export declare class S3IOClient {
	constructor(region: string, Bucket: string)
	getObject(Key: string): Promise<string | null>
	listObjects(
		params: Pick<ListObjectsV2CommandInput, 'ContinuationToken' | 'Delimiter' | 'MaxKeys' | 'Prefix'>,
	): Promise<
		Pick<ListObjectsV2CommandOutput, 'Contents' | 'ContinuationToken' | 'NextContinuationToken' | 'IsTruncated'>
	>
	putObject(Key: string, data: string): Promise<import('@aws-sdk/client-s3').PutObjectCommandOutput>
	deleteObject(Key: string): Promise<import('@aws-sdk/client-s3').DeleteObjectCommandOutput>
}
