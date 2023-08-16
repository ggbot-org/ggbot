import { describeElasticIps } from "@ggbot2/aws"
import { elasticIpAddresses } from "@ggbot2/infrastructure"

export type ElasticIpStatus = {
	InstanceId?: string
	PublicIp: string
	exists: boolean
}

export const getElasticIps = async (): Promise<ElasticIpStatus[]> => {
	const result = await describeElasticIps({ PublicIps: elasticIpAddresses })
	return elasticIpAddresses.map((ipAddress) => {
		const addressInfo = result.Addresses?.find(
			({ PublicIp }) => PublicIp === ipAddress
		)
		if (!addressInfo) return { PublicIp: ipAddress, exists: false }
		return {
			PublicIp: ipAddress,
			exists: true,
			InstanceId: addressInfo.InstanceId
		}
	})
}
