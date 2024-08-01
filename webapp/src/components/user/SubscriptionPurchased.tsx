import { Message } from "_/components/library"
import {
	formattedMessageMarkup,
	formattedMessageMarkupWithLinkTo
} from "_/i18n/formattedMessageMarkup"
import { telegram } from "@workspace/locators"
import { FormattedMessage, useIntl } from "react-intl"

export function SubscriptionPurchased() {
	const { formatMessage } = useIntl()

	return (
		<Message
			color="success"
			header={formatMessage({ id: "SubscriptionPurchased.title" })}
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
