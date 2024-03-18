import { Column, Columns, OneColumn } from "_/components/library"
import { SubscriptionInfo } from "_/components/user/SubscriptionInfo"
import { SubscriptionPurchase } from "_/components/user/SubscriptionPurchase"
import { FC } from "react"

export const BillingSettings: FC = () => (
	<>
		<Columns>
			<OneColumn>
				<SubscriptionInfo />
			</OneColumn>
		</Columns>

		<Columns>
			<Column isNarrow>
				<SubscriptionPurchase />
			</Column>
		</Columns>
	</>
)
