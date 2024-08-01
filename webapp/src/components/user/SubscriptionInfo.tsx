import {
	Columns,
	Control,
	Div,
	Field,
	OneColumn,
	Title
} from "_/components/library"
import { SubscriptionEnd, SubscriptionPlan } from "_/components/readonlyFields"
import { SubscriptionStatus } from "_/components/user/SubscriptionStatus"
import { useSubscription } from "_/hooks/user/useSubscription"
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
				<Div bulma="box">
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

					<SubscriptionPlan value={subscriptionPlan} />

					<SubscriptionEnd value={subscriptionEnd} />
				</Div>
			</OneColumn>
		</Columns>
	)
}
