import { AssociateAddressCommand, AssociateAddressCommandInput, AssociateAddressCommandOutput, DescribeAddressesCommand, DescribeAddressesCommandInput, DescribeAddressesCommandOutput, DisassociateAddressCommand, DisassociateAddressCommandInput, DisassociateAddressCommandOutput } from "@aws-sdk/client-ec2"
import { AwsRegion } from "@workspace/aws-types"

import { ec2Client } from "./client.js"

export async function associateElasticIp (
	region: AwsRegion,
	{ AllocationId, InstanceId }: Required< Pick<AssociateAddressCommandInput, "AllocationId" | "InstanceId"> >
): Promise<AssociateAddressCommandOutput> {
	const command = new AssociateAddressCommand({ AllocationId, InstanceId })
	const client = ec2Client(region)
	return await client.send(command)
}

export async function describeElasticIps (
	region: AwsRegion,
	{ PublicIps }: Required<Pick<DescribeAddressesCommandInput, "PublicIps">>
): Promise<DescribeAddressesCommandOutput> {
	const command = new DescribeAddressesCommand({ PublicIps })
	const client = ec2Client(region)
	return await client.send(command)
}

export async function disassociateElasticIp (
	region: AwsRegion,
	{ AssociationId }: Required<Pick<DisassociateAddressCommandInput, "AssociationId">>
): Promise<DisassociateAddressCommandOutput> {
	const command = new DisassociateAddressCommand({ AssociationId })
	const client = ec2Client(region)
	return await client.send(command)
}
