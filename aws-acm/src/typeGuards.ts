import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AwsCertificateSummary } from "./types.js"

export const isAwsCertificateSummary = objectTypeGuard<AwsCertificateSummary>(
	({ DomainName }) => typeof DomainName === "string"
)
