import { Box, Control, Field, Message, Title } from "@ggbot2/design"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { SubscriptionEnd } from "../components/SubscriptionEnd.js"
import { SubscriptionPlan } from "../components/SubscriptionPlan.js"
import { SubscriptionStatus } from "../components/SubscriptionStatus.js"
import { SubscriptionContext } from "../contexts/Subscription.js"

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
