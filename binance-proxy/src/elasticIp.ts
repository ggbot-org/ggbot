import {
	associateElasticIp,
	describeElasticIps,
	getOwnEc2InstanceId,
	releaseElasticIp
} from "@workspace/aws"
import { ENV } from "@workspace/env"
import { awsRegion } from "@workspace/infrastructure"

import { ErrorCannotParseElasticIps } from "./errors.js"
import { info, warn } from "./logging.js"

const elasticIpsEnv = ENV.BINANCE_PROXY_ELASTIC_IPS()

let elasticIp = ""
let allocationId = ""

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

	const { Addresses } = await describeElasticIps(
		{ region: awsRegion },
		{ PublicIps: elasticIps }
	)
	if (!Addresses) {
		warn("Cannot associate Elastic IP, empty address list")
		return
	}

	for (const elasticIpInfo of Addresses) {
		const { AllocationId, AssociationId, PublicIp } = elasticIpInfo
		// Skip elastic IP if it is already associated.
		if (AssociationId) continue

		if (!AllocationId || !PublicIp) continue

		await associateElasticIp(
			{ region: awsRegion },
			{ AllocationId, InstanceId }
		)
		elasticIp = PublicIp
		allocationId = AllocationId
		info(
			"Elastic IP associated",
			elasticIp,
			"with AllocationId",
			allocationId
		)
	}

	if (!elasticIp)
		warn("Cannot associate Elastic IP, no available address found")
}

export const releaseIp = async () => {
	if (!elasticIp || !allocationId) return
	info("Release IP", elasticIp, "from AllocationId", allocationId)
	await releaseElasticIp(
		{ region: awsRegion },
		{ AllocationId: allocationId }
	)
}
