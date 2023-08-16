import { DeployStage, ENV } from "@ggbot2/env";

import { getLogsArn } from "./cloudWatch.js";
import { lambdaAllArn } from "./lambda.js";
import {
  getAppBucketArn,
  getAssetsBucketArn,
  getDataBucketArn,
  getLogsBucketArn,
  getNakedDomainBucketArn,
  getWwwBucketArn,
} from "./s3.js";
import { getSesIdentityArn } from "./ses.js";

const { AWS_ACCOUNT_ID, DEPLOY_STAGE } = ENV;

// IAM version
const Version = "2012-10-17";

const resources = (deployStage: DeployStage) => ({
  appBucketArn: getAppBucketArn(deployStage),
  dataBucketArn: getDataBucketArn(deployStage),
  logsBucketArn: getLogsBucketArn(deployStage),
  wwwBucketArn: getWwwBucketArn(deployStage),
});

const apiRole = `arn:aws:iam::${AWS_ACCOUNT_ID()}:role/ggbot2_api_role`;

// DeployStage main and next resources
const main = resources("main");
const next = resources("next");
// Cross deployStage resources
const cross = {
  // CloudWatch
  logsArn: getLogsArn(),
  // S3
  assetsBucketArn: getAssetsBucketArn(),
  nakedDomainBucketArn: getNakedDomainBucketArn(),
  // SES
  sesIdentityArn: getSesIdentityArn(),
};

export const getDevopsPolicyName = () => "ggbot2-devops-policy";

export const getDevopsPolicyArn = () =>
  `arn:aws:iam::${AWS_ACCOUNT_ID()}:policy/${getDevopsPolicyName()}`;

export const getDevopsPolicyStatements = () => [
  {
    Effect: "Allow",
    Action: [
      "ec2:DescribeAddresses",
      "elasticloadbalancing:DescribeLoadBalancers",
      "iam:GetPolicy",
      "logs:CreateLogGroup",
    ],
    Resource: "*",
  },
  // iam:PassRole is needed by lambda:CreateFunction
  {
    Effect: "Allow",
    Action: ["iam:PassRole"],
    Resource: apiRole,
  },
  {
    Effect: "Allow",
    Action: [
      "lambda:CreateFunction",
      "lambda:UpdateFunctionCode",
      "lambda:UpdateFunctionConfiguration",
    ],
    Resource: lambdaAllArn,
  },
  {
    Effect: "Allow",
    Action: ["s3:CreateBucket", "s3:GetBucketAcl", "s3:ListBucket"],
    Resource: [
      cross.assetsBucketArn,
      cross.nakedDomainBucketArn,
      main.appBucketArn,
      main.dataBucketArn,
      main.logsBucketArn,
      main.wwwBucketArn,
      next.appBucketArn,
      next.dataBucketArn,
      next.logsBucketArn,
      next.wwwBucketArn,
    ],
  },
  {
    Effect: "Allow",
    Action: ["s3:DeleteObject", "s3:PutObject"],
    Resource: [
      cross.assetsBucketArn,
      `${cross.assetsBucketArn}/*`,
      main.appBucketArn,
      `${main.appBucketArn}/*`,
      next.appBucketArn,
      `${next.appBucketArn}/*`,
      main.wwwBucketArn,
      `${main.wwwBucketArn}/*`,
      next.wwwBucketArn,
      `${next.wwwBucketArn}/*`,
    ],
  },
];

export const getDevopsPolicy = () => ({
  Version,
  Statement: getDevopsPolicyStatements(),
});

export const getSesNoreplyPolicyName = (deployStage = DEPLOY_STAGE()) =>
  `ggbot2-${deployStage}-ses-noreply-policy`;

export const getSesNoreplyPolicyArn = (deployStage = DEPLOY_STAGE()) =>
  `arn:aws:iam::${AWS_ACCOUNT_ID()}:policy/${getSesNoreplyPolicyName(
    deployStage
  )}`;

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
