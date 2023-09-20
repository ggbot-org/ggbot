import { OK } from "./_consoleColors.js"
import { LoadBalancerStatus } from "./_elb.js"
import { IamPolicyStatus } from "./_iam.js"
import { isMainModule } from "./_isMainModule.js"
import { S3BucketStatus } from "./_s3.js"
import { getWebappLoadBalancerStatus } from "./elb-webapp.js"
import { getDevopsPolicyStatus } from "./iam-devops.js"
import { getSesNoreplyPolicyStatus } from "./iam-sesNoreply.js"
import { getDataBucketStatus } from "./s3-data.js"
import { getLogsBucketStatus } from "./s3-logs.js"
// TODO how to check bucket in other region
// import { getNakedDomainBucketStatus } from "./s3-nakedDomain.js";
// import { getWwwBucketStatus } from "./s3-www.js";

type TaskStatus = () => Promise<{
	// IAM
	devopsPolicy: IamPolicyStatus
	sesNoreplyPolicy: IamPolicyStatus
	// S3
	// TODO how to check bucket in other region
	dataBucket: S3BucketStatus
	logsBucket: S3BucketStatus
	// wwwBucket: S3BucketStatus;
	// ELB
	webappLoadBalancer: LoadBalancerStatus
}>

// TODO move this to @workspace/infrastructure test
// import { ElasticIpStatus, getElasticIps } from "./elasticIp.js"
// const elasticIpsReport = (reportKey: string, elasticIps: ElasticIpStatus[]) => {
// 	for (const elasticIp of elasticIps) {
// 		const { PublicIp } = elasticIp
// 		console.info(reportKey, PublicIp, "exists", OK(elasticIp.exists))
// 		if (elasticIp.InstanceId)
// 			console.info(
// 				reportKey,
// 				PublicIp,
// 				"InstanceId",
// 				elasticIp.InstanceId
// 			)
// 	}
// }

const iamPolicyReport = (reportKey: string, iamPolicy: IamPolicyStatus) => {
	console.info(reportKey, "hasProjectTag", OK(iamPolicy.hasProjectTag))
}

const loadBalancerReport = (
	reportKey: string,
	loadBalancer: LoadBalancerStatus
) => {
	console.info(reportKey, "exists", OK(loadBalancer.exists))
	if (!loadBalancer.exists) return
	console.info(reportKey, "typeIsOk", OK(loadBalancer.typeIsOk))
	if (!loadBalancer.typeIsOk)
		console.info(reportKey, "type", loadBalancer.Type)
}

const s3BucketReport = (reportKey: string, s3Bucket: S3BucketStatus) => {
	console.info(reportKey, "exists", OK(s3Bucket.exists))
}

export const taskStatus: TaskStatus = async () => {
	// //////////////////////////////////////////////////////////////////
	console.info("IAM")
	// //////////////////////////////////////////////////////////////////

	const devopsPolicy = await getDevopsPolicyStatus()
	iamPolicyReport("devopsPolicy", devopsPolicy)

	const sesNoreplyPolicy = await getSesNoreplyPolicyStatus()
	iamPolicyReport("sesNoReplyPolicy", sesNoreplyPolicy)

	// //////////////////////////////////////////////////////////////////
	console.info("S3")
	// //////////////////////////////////////////////////////////////////

	const dataBucket = await getDataBucketStatus()
	s3BucketReport("dataBucket", dataBucket)

	const logsBucket = await getLogsBucketStatus()
	s3BucketReport("logsBucket", logsBucket)

	// TODO how to check bucket in other region
	// const nakedDomainBucket = await getNakedDomainBucketStatus();
	// s3BucketReport("nakedDomainBucket", nakedDomainBucket);

	// TODO how to check bucket in other region
	// const wwwBucket = await getWwwBucketStatus();
	// s3BucketReport("wwwBucket", wwwBucket);

	// //////////////////////////////////////////////////////////////////
	console.info("ELB")
	// //////////////////////////////////////////////////////////////////

	const webappLoadBalancer = await getWebappLoadBalancerStatus()
	loadBalancerReport("webappLoadBalancer", webappLoadBalancer)

	// //////////////////////////////////////////////////////////////////
	console.info("EC2")
	// //////////////////////////////////////////////////////////////////

	// const elasticIps = await getElasticIps()
	// elasticIpsReport("elasticIp", elasticIps)

	// //////////////////////////////////////////////////////////////////
	return {
		dataBucket,
		devopsPolicy,
		logsBucket,
		sesNoreplyPolicy,
		webappLoadBalancer
		// wwwBucket,
	}
}

if (isMainModule(import.meta.url)) await taskStatus()
