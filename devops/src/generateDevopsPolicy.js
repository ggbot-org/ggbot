import { getDataBucketArn } from "@ggbot2/infrastructure";
import { isMainModule } from "./_isMainModule.js";

const dataBucketArn = getDataBucketArn();

export const generateDevopsPolicy = () => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:GetBucketAcl", "s3:ListBucket"],
        Resource: [dataBucketArn],
      },
      {
        Effect: "Allow",
        Action: ["elasticloadbalancing:DescribeLoadBalancers"],
        Resource: "*",
      },
    ],
  };
};

if (isMainModule(import.meta.url)) {
  const devopsPolicy = generateDevopsPolicy();
  console.info(JSON.stringify(devopsPolicy, null, 2));
}
