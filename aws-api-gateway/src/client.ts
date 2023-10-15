import { APIGatewayClient } from "@aws-sdk/client-api-gateway"
import { AwsRegion } from "@workspace/aws-types"

export const apiGatewayClient = (region: AwsRegion) =>
	new APIGatewayClient({ region })
