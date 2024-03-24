import {
	ApiService,
	isStripeClientActionInput as isInput,
	StripeClientActionType
} from "@workspace/api"
import { BadRequestError } from "@workspace/http"
import { AccountKey } from "@workspace/models"
import { StripeClient } from "@workspace/stripe"

export class Service implements ApiService<StripeClientActionType> {
	accountKey: AccountKey
	stripe = new StripeClient()

	constructor({ accountKey }: Pick<Service, "accountKey">) {
		this.accountKey = accountKey
	}

	async CreateCheckoutSession(arg: unknown) {
		if (!isInput.CreateCheckoutSession(arg)) throw new BadRequestError()
		const { numMonths } = arg
		const session = await this.stripe.createCheckoutSession({
			quantity: numMonths,
			...this.accountKey
		})
		return {
			url: session.url
		}
	}
}
