import { DeployStage } from '@workspace/env'

export declare class ApiURLs {
	baseURL: URL
	constructor(deployStage: DeployStage, dnsDomain: string)
	get auth(): URL
	get admin(): URL
	get public(): URL
	get stripe(): {
		readonly action: URL;
		readonly webhook: URL;
	}
	get user(): URL
}
