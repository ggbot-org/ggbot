import { LambdaClient } from "@aws-sdk/client-lambda"

export function lambdaClient(region: string) {
	return new LambdaClient({ region })
}
