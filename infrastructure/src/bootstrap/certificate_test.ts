import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import {
	CertificateStatus,
	listCertificates,
	RenewalEligibility
} from "@workspace/aws-acm"
import { ENV } from "@workspace/env"

const DNS_DOMAIN = ENV.DNS_DOMAIN()
const AWS_REGION = ENV.AWS_DATA_REGION()

const { CertificateSummaryList } = await listCertificates(AWS_REGION)

const certificate = CertificateSummaryList?.find(
	({ DomainName }) => DomainName === DNS_DOMAIN
)

describe(`SSL certificate for domain ${DNS_DOMAIN} on region ${AWS_REGION}`, () => {
	test("status is ISSUED", () => {
		assert.ok(certificate?.Status === CertificateStatus.ISSUED)
	})

	test("is ELIGIBLE for renewal", () => {
		assert.ok(
			certificate?.RenewalEligibility === RenewalEligibility.ELIGIBLE
		)
	})
})
