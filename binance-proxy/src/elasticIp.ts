import {
	associateElasticIp,
	describeElasticIps,
	getOwnEc2InstanceId
} from "@workspace/aws"
import { ENV } from "@workspace/env"

import { ErrorCannotParseElasticIps } from "./errors.js"
import { info, warn } from "./logging.js"

const elasticIpsEnv = ENV.BINANCE_PROXY_ELASTIC_IPS()

let elasticIp = ""

export const getElasticIp = () => elasticIp

const looksLikeIp = (ip: unknown) => typeof ip === "string"

const parseElasticIpsFromEnv = () => {
	const elasticIpList = elasticIpsEnv.split(",")
	if (Array.isArray(elasticIpList) && elasticIpList.every(looksLikeIp))
		return elasticIpList
	throw new ErrorCannotParseElasticIps()
}

export const associateIp = async () => {
	const InstanceId = await getOwnEc2InstanceId
	info("Got instanceId", InstanceId)

	const elasticIps = parseElasticIpsFromEnv()
	info("Elastic IPs", elasticIps)

	const { Addresses } = await describeElasticIps({ PublicIps: elasticIps })
	if (!Addresses) {
		warn("Cannot associate Elastic IP, empty address list")
		return
	}

	for (const elasticIpInfo of Addresses) {
		const { AllocationId, AssociationId, PublicIp } = elasticIpInfo
		// Skip elastic IP if it is already associated.
		if (AssociationId) continue

		if (!AllocationId || !PublicIp) continue

		await associateElasticIp({ AllocationId, InstanceId })
		elasticIp = PublicIp
		info("Elastic IP associated", elasticIp)
	}

	if (!elasticIp)
		warn("Cannot associate Elastic IP, no available address found")
}

export const releaseIp = async () => {
	if (!elasticIp) return
	info("Release IP", elasticIp)

	throw new ErrorCannotParseElasticIps()
}
