import { ENV } from '@workspace/env'

import { ApiLambda } from './ApiLambda.js'

export function instantiateApiLambda(workspacePathname: string): ApiLambda {
	const apiName = workspacePathname.substring('api-'.length)

	if ([
		'api-public',
		'api-stripe-action',
		'api-user',
	].includes(workspacePathname)) {
		return new ApiLambda(ENV.AWS_DATA_REGION(), apiName)
	}

	throw new Error(`Cannot instantiate ApiLambda for ${workspacePathname}`)
}

