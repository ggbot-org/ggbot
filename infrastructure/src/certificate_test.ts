import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { listCertificates } from "@workspace/aws"
import { ENV } from "@workspace/env"

import { staticWebsiteAwsRegion } from "./awsRegions.js"

const DNS_DOMAIN = ENV.DNS_DOMAIN()

const { CertificateSummaryList } = await listCertificates(
	staticWebsiteAwsRegion
)

const certificate = CertificateSummaryList?.find(
	({ DomainName }) => DomainName === DNS_DOMAIN
)

describe(`SSL certificate for domain ${DNS_DOMAIN} on region ${staticWebsiteAwsRegion}`, () => {
	test("is used", () => {
		assert.ok(certificate?.InUse)
	})

	test("status is ISSUED", () => {
		assert.ok(certificate?.Status === "ISSUED")
	})

	test("is ELIGIBLE for renewal", () => {
		assert.ok(certificate?.RenewalEligibility === "ELIGIBLE")
	})
})
