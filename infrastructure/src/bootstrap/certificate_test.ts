import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import {
	CertificateStatus,
	listCertificates,
	RenewalEligibility
} from "@workspace/aws-acm"
import { ENV } from "@workspace/env"

import { staticWebsiteAwsRegion } from "../awsRegions.js"

const DNS_DOMAIN = ENV.DNS_DOMAIN()

const { CertificateSummaryList } = await listCertificates(
	staticWebsiteAwsRegion
)

const certificate = CertificateSummaryList?.find(
	({ DomainName }) => DomainName === DNS_DOMAIN
)

describe(`SSL certificate for domain ${DNS_DOMAIN} on region ${staticWebsiteAwsRegion}`, () => {
	test("status is ISSUED", () => {
		assert.ok(certificate?.Status === CertificateStatus.ISSUED)
	})

	test("is ELIGIBLE for renewal", () => {
		assert.ok(
			certificate?.RenewalEligibility === RenewalEligibility.ELIGIBLE
		)
	})
})
