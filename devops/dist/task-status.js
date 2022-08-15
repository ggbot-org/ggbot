import { isMainModule } from "./_isMainModule.js";
import { workerLoadBalancerStatus } from "./elb-worker.js";
import { dataBucketName, getDataBucketStatus, } from "./s3-dataBucket.js";
export const taskStatus = async ({ verbose }) => {
    const dataBucketStatus = await getDataBucketStatus();
    if (verbose) {
        console.info("dataBucket", dataBucketName);
        console.info("dataBucket", "exists", dataBucketStatus.exists);
    }
    await workerLoadBalancerStatus();
    return { dataBucket: dataBucketStatus };
};
if (isMainModule(import.meta.url))
    await taskStatus({ verbose: true });
