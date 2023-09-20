// The AWS region is defined by several @aws-sdk packages as
//
//    region?: string | __Provider<string>;
//
// Redefine it here as a required `string`.
export type AwsClientConfigRegion = {
	region: string
}
