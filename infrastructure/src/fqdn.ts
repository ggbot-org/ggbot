import { ENV } from "@workspace/env"
import { FQDN } from "@workspace/locators"

export const fqdn = new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())
