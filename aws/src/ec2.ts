import { exec } from "node:child_process"

import {
	AssociateAddressCommand,
	AssociateAddressCommandInput,
	AssociateAddressCommandOutput,
	DescribeAddressesCommand,
	DescribeAddressesCommandInput,
	DescribeAddressesCommandOutput,
	EC2Client,
	ReleaseAddressCommand,
	ReleaseAddressCommandInput,
	ReleaseAddressCommandOutput
} from "@aws-sdk/client-ec2"

import { ErrorCannotGetOwnEc2InstanceId } from "./errors.js"
import { AwsRegion } from "./region.js"

const ec2Client = (region: AwsRegion) =>
	new EC2Client({ apiVersion: "2010-12-01", region })

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

/**
 * Get `instance-id` from EC2 metadata.
 *
 * It is assumed this function run on an Amazon Linux instance.
 *
 * @example
 *
 * ```ts
 * const InstanceId = await getOwnEc2InstanceId
 * ```
 *
 * @see {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html}
 */
export const getOwnEc2InstanceId = new Promise<string>((resolve, reject) => {
	exec("ec2-metadata --instance-id", (_error, stdout) => {
		// Expected output for command
		//     ec2-metadata --instance-id
		//
		// is something like
		//     instance-id: i-087a42553011030b0
		//
		// Get string after colon, remove new line and spaces.
		const instanceId = stdout.split(":").pop()?.replace(/\n/, "").trim()
		if (typeof instanceId === "string") resolve(instanceId)
		reject(new ErrorCannotGetOwnEc2InstanceId())
	})
})

export const releaseElasticIp = async (
	region: AwsRegion,
	{ AllocationId }: Required<Pick<ReleaseAddressCommandInput, "AllocationId">>
): Promise<ReleaseAddressCommandOutput> => {
	const command = new ReleaseAddressCommand({ AllocationId })
	const client = ec2Client(region)
	return await client.send(command)
}
