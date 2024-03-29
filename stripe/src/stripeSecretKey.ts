import { DeployStage } from "@workspace/models"

import { ErrorStripeModeInconsistency } from "./errors.js"
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
 * try {
 * 	checkStripeSecretKey(DEPLOY_STAGE, STRIPE_SECRET_KEY)
 * } catch (error) {
 * 	console.error(error)
 * }
 * ```
 */
export const checkStripeSecretKey = (
	deployStage: DeployStage,
	secretKey: string
) => {
	const stripeMode = inferStripeModeFromSecretKey(secretKey)

	let isInconsistent = false
	if (stripeMode === "live" && deployStage !== "main") isInconsistent = true
	if (stripeMode === "test" && deployStage === "main") isInconsistent = true

	if (isInconsistent)
		throw new ErrorStripeModeInconsistency(deployStage, stripeMode)
}
