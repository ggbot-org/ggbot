import { isMainModule } from "./_isMainModule.js";
import { LoadBalancerStatus } from "./_elb.js";
import { S3BucketStatus } from "./_s3.js";
import { getWebappLoadBalancerStatus } from "./elb-webapp.js";
import { getWorkerLoadBalancerStatus } from "./elb-worker.js";
import { getDataBucketStatus } from "./s3-dataBucket.js";

type TaskStatus = (options: { verbose?: boolean | undefined }) => Promise<{
  workerLoadBalancer: LoadBalancerStatus;
  webappLoadBalancer: LoadBalancerStatus;
  dataBucket: S3BucketStatus;
}>;

// Few ANSI color codes
// Reference: https://telepathy.freedesktop.org/doc/telepathy-glib/telepathy-glib-debug-ansi.html
// See also: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const color = {
  reset: "\x1b[0m",
  bg: {
    red: "\x1b[41m",
    green: "\x1b[42m",
  },
};

const NO_COLOR = process.env.NO_COLOR;

const OK = (condition?: boolean, text = String(Boolean(condition))) =>
  NO_COLOR
    ? text
    : `${condition ? color.bg.green : color.bg.red}${text}${color.reset}`;

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

  const webappLoadBalancer = await getWebappLoadBalancerStatus();
  if (verbose) loadBalancerReport("webappLoadBalancer", webappLoadBalancer);

  const workerLoadBalancer = await getWorkerLoadBalancerStatus();
  if (verbose) loadBalancerReport("workerLoadBalancer", workerLoadBalancer);

  return { dataBucket, webappLoadBalancer, workerLoadBalancer };
};

if (isMainModule(import.meta.url)) await taskStatus({ verbose: true });
