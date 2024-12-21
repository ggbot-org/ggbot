export class FQDN {
	/**
	 * @param {import("@workspace/env").DeployStage} deployStage
	 * @param {string} dnsDomain
	 */
	constructor(deployStage, dnsDomain) {
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
