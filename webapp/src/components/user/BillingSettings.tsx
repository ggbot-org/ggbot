import { SubscriptionInfo } from "_/components/user/SubscriptionInfo"
import { SubscriptionPurchase } from "_/components/user/SubscriptionPurchase"
import { FC } from "react"

export const BillingSettings: FC = () => (
	<>
		<SubscriptionInfo />

		<SubscriptionPurchase />
	</>
)
