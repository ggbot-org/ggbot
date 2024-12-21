import { DeployStage } from '@workspace/env'

export declare class ApiURLs {
	constructor(deployStage: DeployStage, dnsDomain: string)
	readonly auth: URL
	readonly admin: URL
	get public(): URL
	readonly stripe: {
		readonly action: URL;
		readonly webhook: URL;
	}
	readonly user: URL
}
