import { isMainModule } from "./_isMainModule.js";
import { OK } from "./_consoleColors.js";
import { LoadBalancerStatus } from "./_elb.js";
import { IamPolicyStatus } from "./_iam.js";
import { S3BucketStatus } from "./_s3.js";
import { TaskOptions } from "./_task.js";
import { getWebappLoadBalancerStatus } from "./elb-webapp.js";
import { getDevopsPolicyStatus } from "./iam-devops.js";
import { getAssetsDomainBucketStatus } from "./s3-assetsDomain.js";
import { getDataBucketStatus } from "./s3-data.js";
import { getLogsBucketStatus } from "./s3-logs.js";
import { getNakedDomainBucketStatus } from "./s3-nakedDomain.js";
import { getWwwDomainBucketStatus } from "./s3-wwwDomain.js";

type TaskStatus = (options: TaskOptions) => Promise<{
  dataBucket: S3BucketStatus;
  devopsPolicy: IamPolicyStatus;
  logsBucket: S3BucketStatus;
  webappLoadBalancer: LoadBalancerStatus;
}>;

const iamPolicyReport = (reportKey: string, iamPolicy: IamPolicyStatus) => {
  console.info(reportKey, "hasProjectTag", OK(iamPolicy.hasProjectTag));
};

const loadBalancerReport = (
  reportKey: string,
  loadBalancer: LoadBalancerStatus
) => {
  console.info(reportKey, "exists", OK(loadBalancer.exists));
  if (!loadBalancer.exists) return;
  console.info(reportKey, "typeIsOk", OK(loadBalancer.typeIsOk));
  if (!loadBalancer.typeIsOk)
    console.info(reportKey, "type", loadBalancer.Type);
};

const s3BucketReport = (reportKey: string, s3Bucket: S3BucketStatus) => {
  console.info(reportKey, "exists", OK(s3Bucket.exists));
};

export const taskStatus: TaskStatus = async ({ verbose }) => {
  const assetsDomainBucket = await getAssetsDomainBucketStatus();
  if (verbose) s3BucketReport("assetsDomainBucket", assetsDomainBucket);

  const devopsPolicy = await getDevopsPolicyStatus();
  if (verbose) iamPolicyReport("devopsPolicy", devopsPolicy);

  const dataBucket = await getDataBucketStatus();
  if (verbose) s3BucketReport("dataBucket", dataBucket);

  const logsBucket = await getLogsBucketStatus();
  if (verbose) s3BucketReport("logsBucket", logsBucket);

  const nakedDomainBucket = await getNakedDomainBucketStatus();
  if (verbose) s3BucketReport("nakedDomainBucket", nakedDomainBucket);

  const wwwDomainBucket = await getWwwDomainBucketStatus();
  if (verbose) s3BucketReport("wwwDomainBucket", wwwDomainBucket);

  const webappLoadBalancer = await getWebappLoadBalancerStatus();
  if (verbose) loadBalancerReport("webappLoadBalancer", webappLoadBalancer);

  return { dataBucket, devopsPolicy, logsBucket, webappLoadBalancer };
};

if (isMainModule(import.meta.url)) await taskStatus({ verbose: true });
