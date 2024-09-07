import { LambdaClient } from "@aws-sdk/client-lambda"
import { AwsRegion } from "@workspace/aws-types"

export function lambdaClient(region: AwsRegion) {
	return new LambdaClient({ region })
}
