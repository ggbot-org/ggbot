import { ENV } from '@workspace/env'

import { getS3DataBucketName, S3DataBucketProvider } from './bucket.js'

export const documentProvider = new S3DataBucketProvider(
	ENV.AWS_DATA_REGION(),
	getS3DataBucketName(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN(), ENV.AWS_DATA_REGION())
)
