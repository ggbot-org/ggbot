import { OK } from "./_consoleColors.js"
import { isMainModule } from "./_isMainModule.js"
import { CreateS3BucketOutput } from "./_s3.js"
import { createDataBucket } from "./s3-data.js"
import { createLogsBucket } from "./s3-logs.js"
import { createNakedDomainBucket } from "./s3-nakedDomain.js"
import { createWebappBucket } from "./s3-www.js"

type TaskCreate = () => Promise<void>

const s3BucketReport = (reportKey: string, s3Bucket: CreateS3BucketOutput) => {
	console.info(reportKey, s3Bucket.name)
	if (s3Bucket.exists) console.info(reportKey, "exists", s3Bucket.exists)
	if (s3Bucket.created)
		console.info(reportKey, "created", OK(s3Bucket.created))
}

export const taskCreate: TaskCreate = async () => {
	const dataBucket = await createDataBucket()
	s3BucketReport("create dataBucket", dataBucket)

	const logsBucket = await createLogsBucket()
	s3BucketReport("create logsBucket", logsBucket)

	const nakedDomainBucket = await createNakedDomainBucket()
	s3BucketReport("create nakedDomainBucket", nakedDomainBucket)

	const webappBucket = await createWebappBucket()
	s3BucketReport("create webappBucket", webappBucket)
}

if (isMainModule(import.meta.url)) await taskCreate()
