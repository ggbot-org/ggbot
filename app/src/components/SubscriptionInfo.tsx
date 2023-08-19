import { Box, Control, Field, Message, Title } from "@ggbot2/design"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { SubscriptionContext } from "../contexts/user/Subscription.js"
import { SubscriptionEnd } from "./SubscriptionEnd.js"
import { SubscriptionPlan } from "./SubscriptionPlan.js"
import { SubscriptionStatus } from "./SubscriptionStatus.js"

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
