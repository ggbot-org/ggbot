import { DeployStage } from "@ggbot2/env";
import { awsAccountId } from "./_env.js";
import { getDataBucketArn, getLogsBucketArn } from "./s3.js";

const resources = (deployStage: DeployStage) => ({
  dataBucketArn: getDataBucketArn(deployStage),
  logsBucketArn: getLogsBucketArn(deployStage),
});

const main = resources("main");
const next = resources("next");

export const getDevopsPolicyName = () => "ggbot2-devops-policy";

export const getDevopsPolicyArn = () =>
  `arn:aws:iam::${awsAccountId}:policy/${getDevopsPolicyName()}`;

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
