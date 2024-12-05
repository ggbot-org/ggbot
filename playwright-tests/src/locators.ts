import { ENV } from '@workspace/env'
import { ApiURLs, FQDN, WebappBaseURL, WebappURLs } from '@workspace/locators'

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
const DNS_DOMAIN = ENV.DNS_DOMAIN()

export const api = new ApiURLs(DEPLOY_STAGE, DNS_DOMAIN)
export const webapp = new WebappURLs(new WebappBaseURL(new FQDN(DEPLOY_STAGE, DNS_DOMAIN)))
