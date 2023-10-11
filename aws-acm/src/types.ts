import { CertificateSummary } from "@aws-sdk/client-acm"

/**
 * Modify `CertificateSummary` from "aws-sdk/client-acm" to have `DomainName`
 * always defined.
 */
export type AwsCertificateSummary = Required<
	Pick<CertificateSummary, "DomainName">
> &
	Omit<CertificateSummary, "DomainName">
