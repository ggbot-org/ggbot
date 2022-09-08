import { DeployStage, getAwsAccountId, getDeployStage } from "@ggbot2/env";
import {
  getAssetsBucketArn,
  getDataBucketArn,
  getLogsBucketArn,
  getNakedDomainBucketArn,
  getWwwBucketArn,
} from "./s3.js";
import { getSesIdentityArn } from "./ses.js";

const defaultDeployStage = getDeployStage();

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
  // S3
  assetsBucketArn: getAssetsBucketArn(),
  nakedDomainBucketArn: getNakedDomainBucketArn(),
  wwwBucketArn: getWwwBucketArn(),
  // SES
  sesIdentityArn: getSesIdentityArn(),
};

export const getDevopsPolicyName = () => "ggbot2-devops-policy";

export const getDevopsPolicyArn = () => {
  const awsAccountId = getAwsAccountId();
  return `arn:aws:iam::${awsAccountId}:policy/${getDevopsPolicyName()}`;
};

export const getDevopsPolicyStatements = () => [
  {
    Effect: "Allow",
    Action: [
      "ec2:DescribeAddresses",
      "elasticloadbalancing:DescribeLoadBalancers",
      "iam:GetPolicy",
    ],
    Resource: "*",
  },
  {
    Effect: "Allow",
    Action: ["s3:CreateBucket", "s3:GetBucketAcl", "s3:ListBucket"],
    Resource: [
      cross.assetsBucketArn,
      cross.nakedDomainBucketArn,
      cross.wwwBucketArn,
      main.dataBucketArn,
      main.logsBucketArn,
      next.dataBucketArn,
      next.logsBucketArn,
    ],
  },
  {
    Effect: "Allow",
    Action: ["s3:PutObject"],
    Resource: [cross.wwwBucketArn, `${cross.wwwBucketArn}/*`],
  },
];

export const getDevopsPolicy = () => ({
  Version,
  Statement: getDevopsPolicyStatements(),
});

export const getSesNoreplyPolicyName = (deployStage = defaultDeployStage) =>
  `ggbot2-${deployStage}-ses-noreply-policy`;

export const getSesNoreplyPolicyArn = (deployStage = defaultDeployStage) => {
  const awsAccountId = getAwsAccountId();
  return `arn:aws:iam::${awsAccountId}:policy/${getSesNoreplyPolicyName(
    deployStage
  )}`;
};

export const getSesNoreplyPolicyStatements = () => [
  {
    Effect: "Allow",
    Action: ["SES:SendEmail", "SES:SendRawEmail"],
    Resource: cross.sesIdentityArn,
  },
];

export const getSesNoreplyPolicy = () => ({
  Version,
  Statement: getSesNoreplyPolicyStatements(),
});
