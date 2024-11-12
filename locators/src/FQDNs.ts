import { DeployStage } from '@workspace/models'

/**
 * Fully qualified domain names.
 *
 * @example
 *
 * ```ts
 * import { DeployStage } from "@workspace/models"
 * import { ENV } from "@workspace/env"
 *
 * const dnsDomain = ENV.DNS_DOMAIN()
 *
 * // Could be provided also by `ENV.DEPLOY_STAGE()`
 * const deployStage: DeployStage = "main"
 *
 * const fqdn = new FQDN(deployStage, dnsDomain)
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Fully_qualified_domain_name}
 */
export class FQDN {
	readonly deployStage: DeployStage
	readonly dnsDomain: string

	constructor(deployStage: DeployStage, dnsDomain: string) {
		this.deployStage = deployStage
		this.dnsDomain = dnsDomain
	}

	get apiDomain() {
		return `${{
			main: 'api',
			next: 'api-next',
			local: 'api-local'
		}[this.deployStage]}.${this.dnsDomain}`
	}

	get authDomain() {
		return `${{
			main: 'auth',
			next: 'auth-next',
			local: 'auth-local'
		}[this.deployStage]}.${this.dnsDomain}`
	}

	get webappDomain() {
		return `${{
			main: 'www',
			// Both `next` and `local` deploy stages point to "next" webapp.
			next: 'next',
			local: 'next',
		}[this.deployStage]}.${this.dnsDomain}`
	}
}
