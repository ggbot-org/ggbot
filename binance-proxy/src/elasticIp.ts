import {
	AssociateAddressCommand,
	DescribeAddressesCommand,
	DisassociateAddressCommand,
	EC2Client,
} from '@aws-sdk/client-ec2'
import { ENV } from '@workspace/env'

import { getOwnEc2InstanceId } from './ec2InstanceId.js'

const BINANCE_PROXY_IP = ENV.BINANCE_PROXY_IP()

let elasticIp: string | undefined
let associationId: string | undefined

const ec2Client = new EC2Client({
	apiVersion: '2010-12-01',
	region: ENV.AWS_BINANCE_PROXY_REGION(),
})

export async function associateIp() {
	const { Addresses } = await ec2Client.send(
		new DescribeAddressesCommand({ PublicIps: [BINANCE_PROXY_IP] })
	)
	if (!Addresses) throw new Error('Cannot associate Elastic IP, no Addresses')

	for (const elasticIpInfo of Addresses) {
		const { AllocationId, PublicIp } = elasticIpInfo
		// Skip elastic IP if it is already associated.
		if (elasticIpInfo.AssociationId) continue

		if (!AllocationId || !PublicIp) continue

		const InstanceId = await getOwnEc2InstanceId
		const { AssociationId } = await ec2Client.send(
			new AssociateAddressCommand({ AllocationId, InstanceId })
		)
		elasticIp = PublicIp
		associationId = AssociationId

		console.info('Elastic IP associated', elasticIp)
	}

	if (!elasticIp)
		throw new Error('Cannot associate Elastic IP, no available address found')
}

export async function disassociateIp() {
	if (!elasticIp || !associationId) return
	console.info('Release IP', elasticIp)
	await ec2Client.send(
		new DisassociateAddressCommand({ AssociationId: associationId })
	)
}
