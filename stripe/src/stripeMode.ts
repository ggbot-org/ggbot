type StripeMode = "live" | "test"

export function inferStripeModeFromSecretKey(secretKey: string): StripeMode {
	if (secretKey.startsWith("sk_test_")) return "test"
	if (secretKey.startsWith("sk_live_")) return "live"
	throw new Error("Cannot infer Stripe mode, check Stripe secret key")
}
