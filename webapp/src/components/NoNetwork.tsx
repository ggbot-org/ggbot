import { Message, Modal } from '_/components/library'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

export function NoNetwork() {
	const [isOffline, setIsOffline] = useState(false)

	useEffect(() => {
		function onOffline() {
			setIsOffline(true)
		}
		function onOnline() {
			setIsOffline(false)
		}
		addEventListener('offline', onOffline)
		addEventListener('online', onOnline)
		return () => {
			removeEventListener('offline', onOffline)
			removeEventListener('online', onOnline)
		}
	}, [])

	if (!isOffline) return null

	return (
		<Modal isActive>
			<Message
				color="warning"
				header={<FormattedMessage id="NoNetwork.title" />}
			>
				<FormattedMessage id="NoNetwork.message" />
			</Message>
		</Modal>
	)
}
