import { ENV } from '@workspace/env'

import { ApiLambda } from './ApiLambda.js'

class ApiPublicLambda extends ApiLambda {
	static workspacePathname = 'api-public'
	constructor() {
		super(ENV.AWS_DATA_REGION(), ApiPublicLambda.workspacePathname)
	}
	async setEnvironment() {
		await super.setEnvironment({
			AWS_DATA_REGION: ENV.AWS_DATA_REGION(),
			...ApiLambda.commonEnvironmentVariables()
		})
	}
}

class ApiStripeActionLambda extends ApiLambda {
	static workspacePathname = 'api-stripe-action'
	constructor() {
		super(ENV.AWS_DATA_REGION(), ApiStripeActionLambda.workspacePathname)
	}
	async setEnvironment() {
		await super.setEnvironment({
			AUTHENTICATION_SECRET: ENV.AUTHENTICATION_SECRET(),
			AWS_DATA_REGION: ENV.AWS_DATA_REGION(),
			STRIPE_PLAN_BASIC_PRICE_ID: ENV.STRIPE_PLAN_BASIC_PRICE_ID(),
			STRIPE_SECRET_KEY: ENV.STRIPE_SECRET_KEY(),
			...ApiLambda.commonEnvironmentVariables()
		})
	}
}

class ApiStripeWebhookLambda extends ApiLambda {
	static workspacePathname = 'api-stripe-webhook'
	constructor() {
		super(ENV.AWS_DATA_REGION(), ApiStripeActionLambda.workspacePathname)
	}
	async setEnvironment() {
		await super.setEnvironment({
			AWS_DATA_REGION: ENV.AWS_DATA_REGION(),
			STRIPE_SECRET_KEY: ENV.STRIPE_SECRET_KEY(),
			...ApiLambda.commonEnvironmentVariables()
		})
	}
}

class ApiUserLambda extends ApiLambda {
	static workspacePathname = 'api-user'
	constructor() {
		super(ENV.AWS_DATA_REGION(), ApiUserLambda.workspacePathname)
	}
	async setEnvironment() {
		await super.setEnvironment({
			AUTHENTICATION_SECRET: ENV.AUTHENTICATION_SECRET(),
			AWS_DATA_REGION: ENV.AWS_DATA_REGION(),
			BINANCE_PROXY_IP: ENV.BINANCE_PROXY_IP(),
			...ApiLambda.commonEnvironmentVariables()
		})
	}
}

export function instantiateApiLambda(workspacePathname: string) {
	switch (workspacePathname) {
		case ApiPublicLambda.workspacePathname: return new ApiPublicLambda()
		case ApiStripeActionLambda.workspacePathname: return new ApiStripeActionLambda()
		case ApiStripeWebhookLambda.workspacePathname: return new ApiStripeWebhookLambda()
		case ApiUserLambda.workspacePathname: return new ApiUserLambda()
		default: throw new Error(`Cannot instantiate ApiLambda for workspace ${workspacePathname}`)
	}
}

