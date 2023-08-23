import { Message, Modal } from "_/components/library"
import { useOfflineDetection } from "_/hooks/useOfflineDetection"
import { FC } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const NoNetwork: FC = () => {
	const { formatMessage } = useIntl()

	const isOffline = useOfflineDetection()

	if (!isOffline) return null

	return (
		<Modal isActive>
			<Message
				color="warning"
				header={formatMessage({ id: "NoNetwork.title" })}
			>
				<FormattedMessage id="NoNetwork.message" />
			</Message>
		</Modal>
	)
}
