import { isMainModule } from "./_isMainModule.js";
import { workerLoadBalancerStatus } from "./elb-worker.js";
import {
  DataBucketStatus,
  dataBucket,
  getDataBucketStatus,
} from "./s3-dataBucket.js";

type TaskStatus = (options: { verbose?: boolean | undefined }) => Promise<{
  dataBucket: DataBucketStatus;
}>;

export const taskStatus: TaskStatus = async ({ verbose }) => {
  const dataBucketStatus = await getDataBucketStatus();
  if (verbose) {
    console.info("dataBucket", dataBucket);
    console.info("dataBucket", "exists", dataBucketStatus.exists);
  }
  await workerLoadBalancerStatus();

  return { dataBucket: dataBucketStatus };
};

if (isMainModule(import.meta.url)) await taskStatus({ verbose: true });
