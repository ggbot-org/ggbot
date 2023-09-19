export const awsRegion = "eu-central-1"

export const awsSesRegion = "us-east-1"

const awsRegions = [awsRegion, awsSesRegion] as const

export type AwsRegion = (typeof awsRegions)[number]
