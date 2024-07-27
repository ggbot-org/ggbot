import {
	Box,
	Columns,
	Control,
	Field,
	OneColumn,
	Title
} from "_/components/library"
import { SubscriptionEnd } from "_/components/user/SubscriptionEnd"
import { SubscriptionPlan } from "_/components/user/SubscriptionPlan"
import { SubscriptionStatus } from "_/components/user/SubscriptionStatus"
import { useSubscription } from "_/hooks/useSubscription"
import { FormattedMessage } from "react-intl"

export function SubscriptionInfo() {
	const {
		subscriptionEnd,
		subscriptionPlan,
		subscriptionStatus,
		hasActiveSubscription
	} = useSubscription()

	if (!hasActiveSubscription) return null

	return (
		<Columns>
			<OneColumn>
				<Box>
					<Title>
						<FormattedMessage id="SubscriptionInfo.title" />
					</Title>

					<Field>
						<Control>
							{subscriptionStatus ? (
								<SubscriptionStatus
									status={subscriptionStatus}
								/>
							) : null}
						</Control>
					</Field>

					<SubscriptionPlan isStatic value={subscriptionPlan} />

					<SubscriptionEnd isStatic value={subscriptionEnd} />
				</Box>
			</OneColumn>
		</Columns>
	)
}
