import { SubscriptionInfo } from "_/components/user/SubscriptionInfo"
import { SubscriptionPurchase } from "_/components/user/SubscriptionPurchase"

export function BillingSettings() {
	return (
		<>
			<SubscriptionInfo />

			<SubscriptionPurchase />
		</>
	)
}
