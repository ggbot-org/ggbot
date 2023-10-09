import { ENV } from "@workspace/env"
import { ApiBaseURL, ApiStripeWebhookURL, FQDN } from "@workspace/locators"
import { newStripe, Stripe } from "@workspace/stripe"

const fqdn = new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())
const apiBase = new ApiBaseURL(fqdn).toString()

export class StripeWebhook {
	static apiVersion: Stripe.WebhookEndpointCreateParams.ApiVersion =
		"2023-08-16"
	static enabledEvents: Array<Stripe.WebhookEndpointCreateParams.EnabledEvent> =
		["payment_intent.succeeded"]

	endpoint: Stripe.WebhookEndpoint | undefined
	private stripe = newStripe()

	get url() {
		return new ApiStripeWebhookURL(apiBase).toString()
	}

	/** Create WebhookEndpoint if it does not exist. */
	async create() {
		const exists = await this.exists()
		if (exists) return
		return await this.stripe.webhookEndpoints.create({
			api_version: StripeWebhook.apiVersion,
			enabled_events: StripeWebhook.enabledEvents,
			url: this.url
		})
	}

	async exists() {
		await this.read()
		return this.endpoint !== undefined
	}

	async read() {
		// If `endpoint` is defined, there is not need to read it twice.
		if (this.endpoint) return
		// List all webhooks and look for one with same URL.
		const webhookEndpoints = await this.stripe.webhookEndpoints.list()
		for (const webhookEndpoint of webhookEndpoints.data) {
			if (webhookEndpoint.url === this.url) {
				this.endpoint = webhookEndpoint
				break
			}
		}
		// TODO if webhookEndpoints.has_more do recursive read
	}
}
