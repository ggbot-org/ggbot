import { Control, Div, Field, MainColor, OneColumn, Tag, Title } from "_/components/library"
import { SubscriptionEnd, SubscriptionPlan } from "_/components/readonlyFields"
import { useSubscription } from "_/hooks/user/useSubscription"
import { SubscriptionStatus as Status } from "@workspace/models"
import { FormattedMessage } from "react-intl"

const colorOf: Record<Status, Extract<MainColor, "primary" | "warning">> = {
	active: "primary",
	expired: "warning"
}

function SubscriptionStatus({ status }: { status: Status | undefined }) {
	if (!status) return null
	return (
		<Tag color={colorOf[status]}>
			<FormattedMessage id={`SubscriptionStatus.${status}`} />
		</Tag>
	)
}

export function SubscriptionInfo() {
	const { subscriptionEnd, subscriptionPlan, subscriptionStatus, hasActiveSubscription } = useSubscription()
	if (!hasActiveSubscription) return null
	return (
		<OneColumn>
			<Div bulma="box">
				<Title>
					<FormattedMessage id="SubscriptionInfo.title" />
				</Title>
				<Field>
					<Control>
						{subscriptionStatus ? (<SubscriptionStatus status={subscriptionStatus} />) : null}
					</Control>
				</Field>
				<SubscriptionPlan value={subscriptionPlan} />
				<SubscriptionEnd value={subscriptionEnd} />
			</Div>
		</OneColumn>
	)
}
