import { OK } from "./_consoleColors.js";
import { isMainModule } from "./_isMainModule.js";
import { CreateS3BucketOutput } from "./_s3.js";
import { TaskOptions } from "./_task.js";
import { createDataBucket } from "./s3-data.js";
import { createLogsBucket } from "./s3-logs.js";

type TaskCreate = (options: TaskOptions) => Promise<void>;

const s3BucketReport = (reportKey: string, s3Bucket: CreateS3BucketOutput) => {
  console.info(reportKey, s3Bucket.name);
  if (s3Bucket.exists) console.info(reportKey, "exists", s3Bucket.exists);
  if (s3Bucket.created)
    console.info(reportKey, "created", OK(s3Bucket.created));
};

export const taskCreate: TaskCreate = async ({ verbose }) => {
  const dataBucket = await createDataBucket();
  if (verbose) s3BucketReport("create dataBucket", dataBucket);

  const logsBucket = await createLogsBucket();
  if (verbose) s3BucketReport("create logsBucket", logsBucket);
};

if (isMainModule(import.meta.url)) await taskCreate({ verbose: true });
