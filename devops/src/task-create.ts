import { OK } from "./_consoleColors.js";
import { isMainModule } from "./_isMainModule.js";
import { CreateS3BucketOutput } from "./_s3.js";
import { TaskOptions } from "./_task.js";
import { createAssetsBucket } from "./s3-assets.js";
import { createDataBucket } from "./s3-data.js";
import { createDesignBucket } from "./s3-design.js";
import { createLogsBucket } from "./s3-logs.js";
import { createNakedDomainBucket } from "./s3-nakedDomain.js";
import { createWwwBucket } from "./s3-www.js";

type TaskCreate = (options: TaskOptions) => Promise<void>;

const s3BucketReport = (reportKey: string, s3Bucket: CreateS3BucketOutput) => {
  console.info(reportKey, s3Bucket.name);
  if (s3Bucket.exists) console.info(reportKey, "exists", s3Bucket.exists);
  if (s3Bucket.created)
    console.info(reportKey, "created", OK(s3Bucket.created));
};

export const taskCreate: TaskCreate = async ({ verbose }) => {
  const assetsBucket = await createAssetsBucket();
  if (verbose) s3BucketReport("create assetsBucket", assetsBucket);

  const dataBucket = await createDataBucket();
  if (verbose) s3BucketReport("create dataBucket", dataBucket);

  const designBucket = await createDesignBucket();
  if (verbose) s3BucketReport("create designBucket", designBucket);

  const logsBucket = await createLogsBucket();
  if (verbose) s3BucketReport("create logsBucket", logsBucket);

  const nakedDomainBucket = await createNakedDomainBucket();
  if (verbose) s3BucketReport("create nakedDomainBucket", nakedDomainBucket);

  const wwwBucket = await createWwwBucket();
  if (verbose) s3BucketReport("create wwwBucket", wwwBucket);
};

if (isMainModule(import.meta.url)) await taskCreate({ verbose: true });
