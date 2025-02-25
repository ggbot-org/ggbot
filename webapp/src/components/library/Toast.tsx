import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Delete, DeleteProps, Notification, NotificationProps } from 'trunx'

export type ToastProps = {
	close: () => void
	color: Extract<NotificationProps['color'], 'info' | 'danger' | 'warning'>
	message: ReactNode
	timeout?: number
}

export function Toast({ close, color, message }: ToastProps) {
	const timeout = 10000
	const [timeoutId, setTimeoutId] = useState(0)

	// Close notification after a while.
	useEffect(() => {
		if (timeoutId) return
		setTimeoutId(
			window.setTimeout(() => {
				close()
			}, timeout)
		)
		return () => {
			window.clearTimeout(timeoutId)
		}
	}, [close, timeoutId])

	// If user interacts with the notification, it will stay around.
	const onClickMessage = useCallback(() => {
		if (!timeoutId) return
		window.clearTimeout(timeoutId)
	}, [timeoutId])

	const onClickClose = useCallback<NonNullable<DeleteProps['onClick']>>(
		(event) => {
			event.stopPropagation()
			close()
		},
		[close]
	)

	return (
		<Notification color={color} onClick={onClickMessage}>
			<Delete onClick={onClickClose} size="small" />
			{message}
		</Notification>
	)
}
