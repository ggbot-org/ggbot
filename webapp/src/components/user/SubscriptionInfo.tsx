import { Box, Control, Field, Message, Title } from "_/components/library"
import { SubscriptionEnd } from "_/components/user/SubscriptionEnd"
import { SubscriptionPlan } from "_/components/user/SubscriptionPlan"
import { SubscriptionStatus } from "_/components/user/SubscriptionStatus"
import { SubscriptionContext } from "_/contexts/user/Subscription"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const SubscriptionInfo: FC = () => {
	const {
		subscriptionEnd,
		subscriptionPlan,
		subscriptionStatus,
		hasActiveSubscription
	} = useContext(SubscriptionContext)

	if (hasActiveSubscription === undefined)
		return (
			<Box>
				<Title>
					<FormattedMessage id="SubscriptionInfo.title" />
				</Title>
			</Box>
		)

	if (hasActiveSubscription === false)
		return (
			<Box>
				<Title>
					<FormattedMessage id="SubscriptionInfo.title" />
				</Title>

				<Message color="info">
					<FormattedMessage id="SubscriptionInfo.pleasePurchase" />
				</Message>
			</Box>
		)

	return (
		<Box>
			<Title>
				<FormattedMessage id="SubscriptionInfo.title" />
			</Title>

			<Field>
				<Control>
					{subscriptionStatus ? (
						<SubscriptionStatus status={subscriptionStatus} />
					) : null}
				</Control>
			</Field>

			<SubscriptionPlan isStatic value={subscriptionPlan} />

			<SubscriptionEnd isStatic value={subscriptionEnd} />
		</Box>
	)
}
