import { ENV } from "@workspace/env"
import { ApiURLs } from "@workspace/locators"

import { newStripe } from "./newStripe.js"
import { Stripe } from "./Stripe.js"

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
const api = new ApiURLs(DEPLOY_STAGE, ENV.DNS_DOMAIN())

const stripe = newStripe()

export class StripeWebhook {
	static apiVersion: Stripe.WebhookEndpointCreateParams.ApiVersion = "2023-08-16"
	static enabledEvents: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
		"checkout.session.completed"
	]

	endpoint: Stripe.WebhookEndpoint | undefined

	constructor() {
		if (DEPLOY_STAGE === "local") throw new Error("A StripeWebhook on local deploy stage does not make sense.")
	}

	get url() {
		return api.stripe.webhook.href
	}

	/** Create WebhookEndpoint if it does not exist. */
	async create() {
		const { url } = this
		console.info("Create StripeWebhook", url)
		const exists = await this.exists()
		if (exists) {
			console.warn("Cannot create StripeWebhook, it already exists.")
			return
		}
		return await stripe.webhookEndpoints.create({
			api_version: StripeWebhook.apiVersion,
			enabled_events: StripeWebhook.enabledEvents,
			url
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
		const webhookEndpoints = await stripe.webhookEndpoints.list()
		for (const webhookEndpoint of webhookEndpoints.data) {
			if (webhookEndpoint.url === this.url) {
				this.endpoint = webhookEndpoint
				break
			}
		}
		// Notice that `webhookEndpoints.has_more` is not handled here:
		// it is assumed there are one of few endpoints, and no pagination.
	}
}
