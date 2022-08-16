import { isMainModule } from "./_isMainModule.js";
import { createDataBucket, dataBucketName } from "./s3-data.js";
import { createLogsBucket, logsBucketName } from "./s3-logs.js";
import { TaskOptions } from "./_task.js";

type TaskCreate = (options: TaskOptions) => Promise<void>;

export const taskCreate: TaskCreate = async ({ verbose }) => {
  if (verbose) console.info("create dataBucket", dataBucketName);
  await createDataBucket();

  if (verbose) console.info("create logsBucket", logsBucketName);
  await createLogsBucket();
};

if (isMainModule(import.meta.url)) await taskCreate({ verbose: true });
