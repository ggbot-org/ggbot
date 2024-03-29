import { DeployStage } from "@workspace/models"

import { Stripe } from "./Stripe.js"
import { StripeMode } from "./stripeMode.js"

const { StripeSignatureVerificationError } = Stripe.errors

export { StripeSignatureVerificationError }

export class ErrorCannotInferStripeMode extends Error {
	static errorName = "ErrorCannotInferStripeMode"
	constructor() {
		super(
			"Cannot infer Stripe mode, check STRIPE_SECRET_KEY environment variable"
		)
	}
}

export class ErrorStripeModeInconsistency extends Error {
	static errorName = "ErrorStripeModeInconsistency"
	constructor(deployStage: DeployStage, stripeMode: StripeMode) {
		super(ErrorStripeModeInconsistency.message(deployStage, stripeMode))
	}
	static message(deployStage: DeployStage, stripeMode: StripeMode) {
		return `Stripe mode is inconsistent with deploy stage, deployStage=${deployStage} stripeMode=${stripeMode}`
	}
}
