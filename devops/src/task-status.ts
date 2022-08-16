import { isMainModule } from "./_isMainModule.js";
import { OK } from "./_consoleColors.js";
import { LoadBalancerStatus } from "./_elb.js";
import { S3BucketStatus } from "./_s3.js";
import { TaskOptions } from "./_task.js";
import { getWebappLoadBalancerStatus } from "./elb-webapp.js";
import { getWorkerLoadBalancerStatus } from "./elb-worker.js";
import { getDataBucketStatus } from "./s3-data.js";
import { getLogsBucketStatus } from "./s3-logs.js";

type TaskStatus = (options: TaskOptions) => Promise<{
  workerLoadBalancer: LoadBalancerStatus;
  webappLoadBalancer: LoadBalancerStatus;
  dataBucket: S3BucketStatus;
}>;

const loadBalancerReport = (
  reportKey: string,
  loadBalancer: LoadBalancerStatus
) => {
  console.info(reportKey, "exists", OK(loadBalancer.exists));
  if (loadBalancer.exists) {
    console.info(reportKey, "name", loadBalancer.LoadBalancerName);
    console.info(reportKey, "typeIsOk", OK(loadBalancer.typeIsOk));
    if (!loadBalancer.typeIsOk)
      console.info(reportKey, "type", loadBalancer.Type);
  }
};

const s3BucketReport = (reportKey: string, s3Bucket: S3BucketStatus) => {
  console.info(reportKey, "exists", OK(s3Bucket.exists));
  console.info(reportKey, "name", s3Bucket.name);
};

export const taskStatus: TaskStatus = async ({ verbose }) => {
  const dataBucket = await getDataBucketStatus();
  if (verbose) s3BucketReport("dataBucket", dataBucket);

  const logsBucket = await getLogsBucketStatus();
  if (verbose) s3BucketReport("logsBucket", logsBucket);

  const webappLoadBalancer = await getWebappLoadBalancerStatus();
  if (verbose) loadBalancerReport("webappLoadBalancer", webappLoadBalancer);

  const workerLoadBalancer = await getWorkerLoadBalancerStatus();
  if (verbose) loadBalancerReport("workerLoadBalancer", workerLoadBalancer);

  return { dataBucket, webappLoadBalancer, workerLoadBalancer };
};

if (isMainModule(import.meta.url)) await taskStatus({ verbose: true });
