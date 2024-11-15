import { ApiService, BadRequestError, isStripeClientActionInput as isInput, StripeClientActionType, StripeMetadata } from '@workspace/api'
import { ENV } from '@workspace/env'
import { StripeClient } from '@workspace/stripe'

export class Service implements ApiService<StripeClientActionType> {
	accountId: StripeMetadata['accountId']
	stripe = new StripeClient()

	constructor({ accountId }: Pick<StripeMetadata, 'accountId'>) {
		this.accountId = accountId
	}

	async CreateCheckoutSession(arg: unknown) {
		if (!isInput.CreateCheckoutSession(arg)) throw new BadRequestError()
		const { email, numMonths, plan } = arg

		const metadata: StripeMetadata = { accountId: this.accountId, plan }

		let price: string
		if (plan === 'basic') price = ENV.STRIPE_PLAN_BASIC_PRICE_ID()
		else throw new BadRequestError()

		const session = await this.stripe.createCheckoutSession({ metadata, email, quantity: numMonths, price })
		return { url: session.url }
	}
}
