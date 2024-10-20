import { associateElasticIp, describeElasticIps, disassociateElasticIp, getOwnEc2InstanceId } from "@workspace/aws-ec2"
import { ENV } from "@workspace/env"

const BINANCE_PROXY_IP = ENV.BINANCE_PROXY_IP()
const AWS_BINANCE_PROXY_REGION = ENV.AWS_BINANCE_PROXY_REGION()

let elasticIp = ""
let associationId = ""

export async function associateIp() {
	const InstanceId = await getOwnEc2InstanceId
	console.info("Got instanceId", InstanceId)

	console.info("Elastic IP", BINANCE_PROXY_IP)

	const { Addresses } = await describeElasticIps(AWS_BINANCE_PROXY_REGION, { PublicIps: [BINANCE_PROXY_IP] })
	if (!Addresses) throw new Error("Cannot associate Elastic IP, empty address list")

	for (const elasticIpInfo of Addresses) {
		const { AllocationId, PublicIp } = elasticIpInfo
		// Skip elastic IP if it is already associated.
		if (elasticIpInfo.AssociationId) continue

		if (!AllocationId || !PublicIp) continue

		const { AssociationId } = await associateElasticIp(AWS_BINANCE_PROXY_REGION, { AllocationId, InstanceId })
		elasticIp = PublicIp
		if (AssociationId) associationId = AssociationId

		console.info("Elastic IP associated", elasticIp)
	}

	if (!elasticIp) throw new Error("Cannot associate Elastic IP, no available address found")
}

export async function disassociateIp() {
	if (!elasticIp || !associationId) return
	console.info("Release IP", elasticIp)
	await disassociateElasticIp(AWS_BINANCE_PROXY_REGION, { AssociationId: associationId })
}
