export type AwsAccountId = string

// The AWS region is defined by several @aws-sdk packages as
//
//    region?: string | __Provider<string>;
export type AwsRegion = string

export type AwsResource = {
	readonly arn: string
}
