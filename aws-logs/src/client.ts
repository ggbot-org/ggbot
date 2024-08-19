import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs"
import { AwsRegion } from "@workspace/aws-types"

export function cloudwatchLogsClient(region: AwsRegion) {
	return new CloudWatchLogsClient({ region })
}
