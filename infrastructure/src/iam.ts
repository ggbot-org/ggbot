import { DeployStage, getAwsAccountId } from "@ggbot2/env";
import { getDataBucketArn, getLogsBucketArn } from "./s3.js";

// IAM version
const Version = "2012-10-17";

const resources = (deployStage: DeployStage) => ({
  dataBucketArn: getDataBucketArn(deployStage),
  logsBucketArn: getLogsBucketArn(deployStage),
});

const main = resources("main");
const next = resources("next");

export const getDevopsPolicyName = () => "ggbot2-devops-policy";

export const getDevopsPolicyArn = () => {
  const awsAccountId = getAwsAccountId();
  return `arn:aws:iam::${awsAccountId}:policy/${getDevopsPolicyName()}`;
};

export const devopsPolicyStatements = () => [
  {
    Effect: "Allow",
    Action: ["elasticloadbalancing:DescribeLoadBalancers", "iam:GetPolicy"],
    Resource: "*",
  },
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
];

export const getDevopsPolicy = () => ({
  Version,
  Statement: devopsPolicyStatements(),
});