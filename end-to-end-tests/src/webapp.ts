import { ENV } from "@workspace/env"
import { WebappURLs } from "@workspace/locators"

export const webapp = new WebappURLs("next", ENV.DNS_DOMAIN())
