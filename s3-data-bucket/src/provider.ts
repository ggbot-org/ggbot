import { ENV } from '@workspace/env'

import { getS3DataBucketName, S3DataBucketProvider } from './bucket.js'

const awsDataRegion = ENV.AWS_DATA_REGION()

export const documentProvider = new S3DataBucketProvider(
	awsDataRegion,
	getS3DataBucketName(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN(), awsDataRegion)
)
