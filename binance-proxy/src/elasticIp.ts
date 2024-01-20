import {
	associateElasticIp,
	describeElasticIps,
	disassociateElasticIp,
	getOwnEc2InstanceId
} from "@workspace/aws-ec2"
import { ENV } from "@workspace/env"

import {
	ErrorCannotParseElasticIps,
	ErrorElasticIpsListIsEmpty,
	ErrorNoElasticIpAvailable
} from "./errors.js"
import { info } from "./logging.js"

const BINANCE_PROXY_ELASTIC_IPS = ENV.BINANCE_PROXY_ELASTIC_IPS()
const AWS_BINANCE_PROXY_REGION = ENV.AWS_BINANCE_PROXY_REGION()

let elasticIp = ""
let associationId = ""

export const getElasticIp = () => elasticIp

const looksLikeIp = (ip: unknown) => typeof ip === "string"

const parseElasticIpsFromEnv = () => {
	const elasticIpList = BINANCE_PROXY_ELASTIC_IPS.split(",")
	if (Array.isArray(elasticIpList) && elasticIpList.every(looksLikeIp))
		return elasticIpList
	throw new ErrorCannotParseElasticIps()
}

export const associateIp = async () => {
	const InstanceId = await getOwnEc2InstanceId
	info("Got instanceId", InstanceId)

	const elasticIps = parseElasticIpsFromEnv()
	info("Elastic IPs", elasticIps)

	const { Addresses } = await describeElasticIps(AWS_BINANCE_PROXY_REGION, {
		PublicIps: elasticIps
	})
	if (!Addresses) throw new ErrorElasticIpsListIsEmpty()

	for (const elasticIpInfo of Addresses) {
		const { AllocationId, PublicIp } = elasticIpInfo
		// Skip elastic IP if it is already associated.
		if (elasticIpInfo.AssociationId) continue

		if (!AllocationId || !PublicIp) continue

		const { AssociationId } = await associateElasticIp(
			AWS_BINANCE_PROXY_REGION,
			{
				AllocationId,
				InstanceId
			}
		)
		elasticIp = PublicIp
		if (AssociationId) associationId = AssociationId

		info("Elastic IP associated", elasticIp)
	}

	if (!elasticIp) throw new ErrorNoElasticIpAvailable()
}

export const disassociateIp = async () => {
	if (!elasticIp || !associationId) return
	info("Release IP", elasticIp)
	await disassociateElasticIp(AWS_BINANCE_PROXY_REGION, {
		AssociationId: associationId
	})
}
