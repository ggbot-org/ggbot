import { CertificateStatus, ListCertificatesCommand } from "@aws-sdk/client-acm"
import { AwsRegion } from "@workspace/aws-types"

import { acmClient } from "./client.js"
import { isAwsCertificateSummary } from "./typeGuards.js"
import { AwsCertificateSummary } from "./types.js"

/**
 * Same as `ListCertificatesCommandOutput` from `@aws-sdk/client-acm` but with
 * `CertificateSummary` always an array.
 */
type ListCertificatesOutput = {
	CertificateSummaryList: AwsCertificateSummary[]
}

export const listCertificates = async (
	region: AwsRegion
): Promise<ListCertificatesOutput> => {
	const command = new ListCertificatesCommand({
		CertificateStatuses: [
			CertificateStatus.EXPIRED,
			CertificateStatus.ISSUED
		]
	})
	const client = acmClient(region)
	const result = await client.send(command)
	const CertificateSummaryList: AwsCertificateSummary[] = []
	const list = result.CertificateSummaryList
	if (Array.isArray(list))
		for (const item of list)
			if (isAwsCertificateSummary(item)) CertificateSummaryList.push(item)
	return { CertificateSummaryList }
}
