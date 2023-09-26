export type { AwsResource } from "./AwsResource.js"
export {
	associateElasticIp,
	describeElasticIps,
	getOwnEc2InstanceId,
	releaseElasticIp
} from "./ec2.js"
export { LoadBalancerTypeEnum } from "./elb.js"
export { ErrorCannotGetOwnEc2InstanceId } from "./errors.js"
export type { Tag } from "./iam.js"
export { getPolicy } from "./iam.js"
export type { S3BucketACL } from "./s3.js"
export { s3ServiceExceptionName } from "./s3.js"
export { S3Bucket } from "./S3Bucket.js"
export { S3IOClient } from "./S3IOClient.js"
export { sendEmail } from "./ses.js"
