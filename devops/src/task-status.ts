import { isMainModule } from "./_isMainModule.js";
import { OK } from "./_consoleColors.js";
import { LoadBalancerStatus } from "./_elb.js";
import { IamPolicyStatus } from "./_iam.js";
import { S3BucketStatus } from "./_s3.js";
import { TaskOptions } from "./_task.js";
import { getWebappLoadBalancerStatus } from "./elb-webapp.js";
import { getDevopsPolicyStatus } from "./iam-devops.js";
import { getSesNoreplyPolicyStatus } from "./iam-sesNoreply.js";
import { getAssetsBucketStatus } from "./s3-assets.js";
import { getDataBucketStatus } from "./s3-data.js";
import { getLogsBucketStatus } from "./s3-logs.js";
import { getNakedDomainBucketStatus } from "./s3-nakedDomain.js";
import { getWwwBucketStatus } from "./s3-www.js";

type TaskStatus = (options: TaskOptions) => Promise<{
  // IAM
  devopsPolicy: IamPolicyStatus;
  sesNoreplyPolicy: IamPolicyStatus;
  // S3
  assetsBucket: S3BucketStatus;
  dataBucket: S3BucketStatus;
  logsBucket: S3BucketStatus;
  wwwBucket: S3BucketStatus;
  // ELB
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
  // //////////////////////////////////////////////////////////////////
  if (verbose) console.info("IAM");
  // //////////////////////////////////////////////////////////////////

  const devopsPolicy = await getDevopsPolicyStatus();
  if (verbose) iamPolicyReport("devopsPolicy", devopsPolicy);

  const sesNoreplyPolicy = await getSesNoreplyPolicyStatus();
  if (verbose) iamPolicyReport("sesNoReplyPolicy", sesNoreplyPolicy);

  // //////////////////////////////////////////////////////////////////
  if (verbose) console.info("S3");
  // //////////////////////////////////////////////////////////////////

  const assetsBucket = await getAssetsBucketStatus();
  if (verbose) s3BucketReport("assetsDomainBucket", assetsBucket);

  const dataBucket = await getDataBucketStatus();
  if (verbose) s3BucketReport("dataBucket", dataBucket);

  const logsBucket = await getLogsBucketStatus();
  if (verbose) s3BucketReport("logsBucket", logsBucket);

  const nakedDomainBucket = await getNakedDomainBucketStatus();
  if (verbose) s3BucketReport("nakedDomainBucket", nakedDomainBucket);

  const wwwBucket = await getWwwBucketStatus();
  if (verbose) s3BucketReport("wwwBucket", wwwBucket);

  // //////////////////////////////////////////////////////////////////
  if (verbose) console.info("ELB");
  // //////////////////////////////////////////////////////////////////

  const webappLoadBalancer = await getWebappLoadBalancerStatus();
  if (verbose) loadBalancerReport("webappLoadBalancer", webappLoadBalancer);

  // //////////////////////////////////////////////////////////////////
  return {
    assetsBucket,
    dataBucket,
    devopsPolicy,
    logsBucket,
    sesNoreplyPolicy,
    webappLoadBalancer,
    wwwBucket,
  };
};

if (isMainModule(import.meta.url)) await taskStatus({ verbose: true });
