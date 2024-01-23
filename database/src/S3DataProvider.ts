import { ENV } from "@workspace/env"
import { DeployStage } from "@workspace/models"

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
const DNS_DOMAIN = ENV.DNS_DOMAIN()
const AWS_DATA_REGION = ENV.AWS_DATA_REGION()

const nextDeployStage: DeployStage = "next"

// TODO remove this
export const getDataBucketName = (deployStage = DEPLOY_STAGE) =>
	deployStage === "local"
		? `${nextDeployStage}-data.${AWS_DATA_REGION}.${DNS_DOMAIN}`
		: `${deployStage}-data.${AWS_DATA_REGION}.${DNS_DOMAIN}`
