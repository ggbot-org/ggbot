import { ErrorCannotInferStripeMode } from "./errors.js"

const stripeModes = ["live", "test"] as const
export type StripeMode = (typeof stripeModes)[number]

export function inferStripeModeFromSecretKey(secretKey: string): StripeMode {
	if (secretKey.startsWith("sk_test_")) return "test"
	if (secretKey.startsWith("sk_live_")) return "live"
	throw new ErrorCannotInferStripeMode()
}
