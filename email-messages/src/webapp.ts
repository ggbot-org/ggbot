import { ENV } from "@workspace/env"
import { WebappURLs } from "@workspace/locators"

export const webapp = new WebappURLs(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())
