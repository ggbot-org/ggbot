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
import { AwsClientConfigRegion } from "./region.js"

export type { Address as ElasticIp } from "@aws-sdk/client-ec2"

type EC2ClientArgs = AwsClientConfigRegion

const ec2Client = (args: EC2ClientArgs) => new EC2Client(args)

export type AssociateElasticIpsArgs = Required<
	Pick<AssociateAddressCommandInput, "AllocationId" | "InstanceId">
>

export const associateElasticIp = async (
	clientArgs: EC2ClientArgs,
	commandArgs: AssociateElasticIpsArgs
): Promise<AssociateAddressCommandOutput> => {
	const command = new AssociateAddressCommand(commandArgs)
	const client = ec2Client(clientArgs)
	return await client.send(command)
}

export type DescribeElasticIpsArgs = Required<
	Pick<DescribeAddressesCommandInput, "PublicIps">
>

export const describeElasticIps = async (
	clientArgs: EC2ClientArgs,
	commandArgs: DescribeElasticIpsArgs
): Promise<DescribeAddressesCommandOutput> => {
	const command = new DescribeAddressesCommand(commandArgs)
	const client = ec2Client(clientArgs)
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

export type ReleaseElasticIpArgs = Required<
	Pick<ReleaseAddressCommandInput, "AllocationId">
>

export const releaseElasticIp = async (
	clientArgs: EC2ClientArgs,
	commandArgs: ReleaseElasticIpArgs
): Promise<ReleaseAddressCommandOutput> => {
	const command = new ReleaseAddressCommand(commandArgs)
	const client = ec2Client(clientArgs)
	return await client.send(command)
}
