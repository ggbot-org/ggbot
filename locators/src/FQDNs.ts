import { DeployStage } from "@workspace/models"

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

	constructor(
		deployStage: FQDN["deployStage"],
		dnsDomain: FQDN["dnsDomain"]
	) {
		this.deployStage = deployStage
		this.dnsDomain = dnsDomain
	}

	get apiDomain() {
		const subDomain: Record<DeployStage, string> = {
			main: "api",
			next: "api-next",
			local: "api-local"
		}
		return `${subDomain[this.deployStage]}.${this.dnsDomain}`
	}

	get authDomain() {
		const subDomain: Record<DeployStage, string> = {
			main: "auth",
			next: "auth-next",
			local: "auth-local"
		}
		return `${subDomain[this.deployStage]}.${this.dnsDomain}`
	}

	get webappDomain() {
		return FQDN.webappDomain(this.deployStage, this.dnsDomain)
	}

	static webappDomain(deployStage: DeployStage, dnsDomain: string) {
		if (deployStage === "main") return `www.${dnsDomain}`
		// Both `next` and `local` deploy stages point to "next" webapp.
		return `next.${dnsDomain}`
	}
}
