import { ErrorCannotInferStripeMode } from "./errors.js"

export type StripeMode = "live" | "test"

export function inferStripeModeFromSecretKey(secretKey: string): StripeMode {
	if (secretKey.startsWith("sk_test_")) return "test"
	if (secretKey.startsWith("sk_live_")) return "live"
	throw new ErrorCannotInferStripeMode()
}
