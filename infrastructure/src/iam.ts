import { DeployStage, getAwsAccountId } from "@ggbot2/env";
import {
  getDataBucketArn,
  getLogsBucketArn,
  getNakedDomainBucketArn,
} from "./s3.js";

// IAM version
const Version = "2012-10-17";

const resources = (deployStage: DeployStage) => ({
  dataBucketArn: getDataBucketArn(deployStage),
  logsBucketArn: getLogsBucketArn(deployStage),
});

// DeployStage main and next resources
const main = resources("main");
const next = resources("next");
// Cross deployStage resources
const cross = {
  nakedDomainBucketArn: getNakedDomainBucketArn(),
};

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
      cross.nakedDomainBucketArn,
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
