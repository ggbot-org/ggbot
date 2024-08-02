import { IAMClient } from "@aws-sdk/client-iam"
import { AwsRegion } from "@workspace/aws-types"

export const iamVersion = "2012-10-17"

export const iamClient = (region: AwsRegion) => new IAMClient({ apiVersion: iamVersion, region })
