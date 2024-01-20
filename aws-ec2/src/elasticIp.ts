import {
	AssociateAddressCommand,
	AssociateAddressCommandInput,
	AssociateAddressCommandOutput,
	DescribeAddressesCommand,
	DescribeAddressesCommandInput,
	DescribeAddressesCommandOutput
} from "@aws-sdk/client-ec2"
import { AwsRegion } from "@workspace/aws-types"

import { ec2Client } from "./client.js"

export const associateElasticIp = async (
	region: AwsRegion,
	{
		AllocationId,
		InstanceId
	}: Required<
		Pick<AssociateAddressCommandInput, "AllocationId" | "InstanceId">
	>
): Promise<AssociateAddressCommandOutput> => {
	const command = new AssociateAddressCommand({ AllocationId, InstanceId })
	const client = ec2Client(region)
	return await client.send(command)
}

export const describeElasticIps = async (
	region: AwsRegion,
	{ PublicIps }: Required<Pick<DescribeAddressesCommandInput, "PublicIps">>
): Promise<DescribeAddressesCommandOutput> => {
	const command = new DescribeAddressesCommand({ PublicIps })
	const client = ec2Client(region)
	return await client.send(command)
}
