import {
	ACMClient,
	CertificateStatus,
	ListCertificatesCommand,
	ListCertificatesCommandOutput
} from "@aws-sdk/client-acm"

import { AwsRegion } from "./region.js"

const acmClient = (region: AwsRegion) =>
	new ACMClient({ apiVersion: "2015-12-08", region })

export const listCertificates = async (
	region: AwsRegion
): Promise<ListCertificatesCommandOutput> => {
	const command = new ListCertificatesCommand({
		CertificateStatuses: [
			CertificateStatus.EXPIRED,
			CertificateStatus.ISSUED
		]
	})
	const client = acmClient(region)
	return await client.send(command)
}
