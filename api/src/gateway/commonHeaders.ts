import { ENV } from '@workspace/env'
import { FQDN, WebappBaseURL } from '@workspace/locators'

const fqdn = new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())

export const commonHeaders = {
	'Access-Control-Allow-Credentials': 'true',
	'Access-Control-Allow-Origin': new WebappBaseURL(fqdn).origin,
}
