import { Message } from "_/components/library"
import { formattedMessageMarkup, formattedMessageMarkupWithLinkTo } from "_/i18n/formattedMessageMarkup"
import { telegram } from "@workspace/locators"
import { FormattedMessage } from "react-intl"

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
