import { ENV } from "@workspace/env"
import { ApiBaseURL, ApiStripeWebhookURL, FQDN } from "@workspace/locators"
import { newStripe,Stripe } from "@workspace/stripe"

const fqdn = new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())
const apiBase = new ApiBaseURL(fqdn).toString()

export class StripeWebhook {
	static url = new ApiStripeWebhookURL(apiBase).toString()
	static apiVersion: Stripe.WebhookEndpointCreateParams.ApiVersion =
		"2023-08-16"

	private stripe = newStripe()

	async create() {
		this.stripe.webhookEndpoints.create({
			api_version: StripeWebhook.apiVersion,
			enabled_events: [],
			url: StripeWebhook.url
		})
	}
}
