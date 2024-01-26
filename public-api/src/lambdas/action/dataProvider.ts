import { PublicDatabase } from "@workspace/database"
import { ENV } from "@workspace/env"
import {
	getS3DataBucketName,
	S3DataBucketProvider
} from "@workspace/s3-data-bucket"

const awsDataRegion = ENV.AWS_DATA_REGION()

const documentProvider = new S3DataBucketProvider(
	awsDataRegion,
	getS3DataBucketName(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN(), awsDataRegion)
)

export const dataProvider = new PublicDatabase(documentProvider)

