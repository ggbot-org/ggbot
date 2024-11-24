import { Message } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { formattedMessageMarkup, formattedMessageMarkupWithLinkTo } from '_/i18n/formattedMessageMarkup'
import { telegram } from '@workspace/locators'

export function SubscriptionPurchased() {
	return (
		<Message
			color="success"
			header={<FormattedMessage id="SubscriptionPurchased.title" />}
		>
			<p>
				<FormattedMessage
					id="SubscriptionPurchased.message"
					values={formattedMessageMarkup}
				/>
			</p>
			<p>
				<FormattedMessage
					id="SubscriptionPurchased.support"
					values={formattedMessageMarkupWithLinkTo(telegram.support)}
				/>
			</p>
		</Message>
	)
}
