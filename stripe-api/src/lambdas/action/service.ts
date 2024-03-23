import {
	ApiService,
	isStripeClientActionInput as isInput,
	StripeClientActionType
} from "@workspace/api"
import { BadRequestError } from "@workspace/http"
import { StripeClient } from "@workspace/stripe"

export class Service implements ApiService<StripeClientActionType> {
	stripe = new StripeClient()

	async CreateCheckoutSession(arg: unknown) {
		if (!isInput.CreateCheckoutSession(arg)) throw new BadRequestError()
		const { numMonths } = arg
		const session = await this.stripe.createCheckoutSession({
			quantity: numMonths
		})
		return {
			url: session.url
		}
	}
}
