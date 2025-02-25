import { Message } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { telegram } from '@workspace/locators'

export function SubscriptionPurchased() {
	return (
		<Message
			color="success"
			header={<FormattedMessage id="SubscriptionPurchased.title" />}
		>
			<p>
				<FormattedMessage id="SubscriptionPurchased.message" />
			</p>
			<p>
				<FormattedMessage
					id="SubscriptionPurchased.support"
					values={{ href: telegram.support }}
				/>
			</p>
		</Message>
	)
}
