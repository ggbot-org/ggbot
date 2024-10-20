import { DeployStage } from "@workspace/models"

import { inferStripeModeFromSecretKey } from "./stripeMode.js"

/**
 * Check that Stripe secret key is consistent with deploy stage, otherwise throw
 * an error.
 *
 * @example
 *
 * ```ts
 * import { ENV } from "@workspace/env"
 *
 * const STRIPE_SECRET_KEY = ENV.STRIPE_SECRET_KEY()
 * const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
 *
 * checkStripeSecretKey(DEPLOY_STAGE, STRIPE_SECRET_KEY)
 * ```
 */
export function checkStripeSecretKey(deployStage: DeployStage, secretKey: string) {
	const stripeMode = inferStripeModeFromSecretKey(secretKey)

	if (
		// Check if stripeMode is consistent with deployStage.
		(stripeMode === "live" && deployStage !== "main") || (stripeMode === "test" && deployStage === "main")
	) {
		throw new Error(`Stripe mode is inconsistent with deploy stage, deployStage=${deployStage} stripeMode=${stripeMode}`)
	}
}
