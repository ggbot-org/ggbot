import { DocumentProviderLevel3, DocumentProviderListItemsInput } from '@workspace/api'
import { DeployStage } from '@workspace/env'
import { DeletionTime, SerializableData, UpdateTime } from '@workspace/models'

export declare function getS3DataBucketName(deployStage: DeployStage, dnsDomain: string, awsRegion: string): string

export declare class S3DataBucketProvider implements DocumentProviderLevel3 {
	constructor(awsRegion: string, bucketName: string)
	getItem<Data extends SerializableData>(key: string): Promise<Data | null>
	removeItem(key: string): Promise<DeletionTime>
	setItem(key: string, data: SerializableData): Promise<UpdateTime>
	listItems({ prefix, token, numItems }: DocumentProviderListItemsInput): Promise<{
		keys: string[];
		nextToken: string | undefined;
	}>
}
