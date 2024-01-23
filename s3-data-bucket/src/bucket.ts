import { DeployStage } from "@workspace/models"
import { AwsRegion } from "@workspace/aws-types"

const nextDeployStage: DeployStage = "next"

export const getS3DataBucketName = (
		deployStage: DeployStage, dnsDomain: string, awsRegion: AwsRegion
) => deployStage === "local"
		? `${nextDeployStage}-data.${awsRegion}.${dnsDomain}`
		: `${deployStage}-data.${awsRegion}.${dnsDomain}`
