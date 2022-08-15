import { dataBucketArn } from "@ggbot2/infrastructure";
import { isMainModule } from "./_isMainModule.js";

export const generateDevopsPolicy = () => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:GetBucketAcl", "s3:ListBucket"],
        Resource: [dataBucketArn],
      },
    ],
  };
};

if (isMainModule(import.meta.url)) {
  const devopsPolicy = generateDevopsPolicy();
  console.info(JSON.stringify(devopsPolicy, null, 2));
}
