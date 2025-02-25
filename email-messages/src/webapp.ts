import { ENV } from '@workspace/env'
import { FQDN, WebappBaseURL, WebappURLs } from '@workspace/locators'

export const webapp = new WebappURLs(
	new WebappBaseURL(new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN()))
)
