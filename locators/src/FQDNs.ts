import { DeployStage } from "@workspace/models"

/**
 * Fully qualified domain names.
 *
 * @example
 *
 * ```ts
 * import { ENV } from "@workspace/env"
 *
 * const dnsDomain = ENV.DNS_DOMAIN()
 * const deployStage = ENV.DEPLOY_STAGE()
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

	get apiDomain(): string {
		const { deployStage, dnsDomain } = this
		switch (deployStage) {
			case "main":
				return `api.${dnsDomain}`
			case "next":
				return `api-next.${dnsDomain}`
			case "local":
				return `api-local.${dnsDomain}`
		}
	}

	get authDomain(): string {
		const { deployStage, dnsDomain } = this
		switch (deployStage) {
			case "main":
				return `auth.${dnsDomain}`
			case "next":
				return `auth-next.${dnsDomain}`
			case "local":
				return `auth-local.${dnsDomain}`
		}
	}

	get webappDomain(): string {
		const { deployStage, dnsDomain } = this
		if (deployStage === "main") return `www.${dnsDomain}`
		return `next.${dnsDomain}`
	}
}
