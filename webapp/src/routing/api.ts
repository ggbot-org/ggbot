import { ApiBaseURL, AuthBaseURL, FQDN } from "@workspace/locators"

const fqdn = new FQDN(DEPLOY_STAGE, DNS_DOMAIN)

export const apiBase = new ApiBaseURL(fqdn).toString()

export const authBase = new AuthBaseURL(fqdn).toString()
