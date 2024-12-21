import { DeployStage } from '@workspace/env'

/**
 * Fully qualified domain names.
 *
 * @example
 *
 * ```js
 * import { ENV } from '@workspace/env'
 *
 * const dnsDomain = ENV.DNS_DOMAIN()
 *
 * // Could be provided also by `ENV.DEPLOY_STAGE()`
 * const deployStage = 'main'
 *
 * const fqdn = new FQDN(deployStage, dnsDomain)
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Fully_qualified_domain_name}
 */
export declare class FQDN {
	readonly deployStage: DeployStage
	readonly dnsDomain: string
	constructor(deployStage: DeployStage, dnsDomain: string)
	get apiDomain(): string
	get authDomain(): string
	get webappDomain(): string
}
