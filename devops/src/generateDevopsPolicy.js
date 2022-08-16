import { getDataBucketArn, getLogsBucketArn } from "@ggbot2/infrastructure";
import { isMainModule } from "./_isMainModule.js";

const resources = (deployStage) => ({
  dataBucketArn: getDataBucketArn(deployStage),
  logsBucketArn: getLogsBucketArn(deployStage),
});

const main = resources("main");
const next = resources("next");

export const generateDevopsPolicy = () => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:CreateBucket", "s3:GetBucketAcl", "s3:ListBucket"],
        Resource: [
          main.dataBucketArn,
          main.logsBucketArn,
          next.dataBucketArn,
          next.logsBucketArn,
        ],
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
