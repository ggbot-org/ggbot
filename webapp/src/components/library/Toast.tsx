import { ReactNode, useCallback, useEffect, useRef } from "react"
import { Delete, DeleteProps, Notification, NotificationProps } from "trunx"

export type ToastProps = {
	close: () => void
	color: Extract<NotificationProps["color"], "info" | "danger" | "warning">
	message: ReactNode
	timeout?: number
}

export function Toast({ close, color, message }: ToastProps) {
	const timeout = 10000
	const timeoutIdRef = useRef(0)

	// Close notification after a while.
	useEffect(() => {
		timeoutIdRef.current = window.setTimeout(() => {
			close()
		}, timeout)
		return () => {
			window.clearTimeout(timeoutIdRef.current)
		}
	}, [close, timeoutIdRef])

	// If user interacts with the notification, it will stay around.
	const onClickMessage = useCallback(() => {
		window.clearTimeout(timeoutIdRef.current)
	}, [timeoutIdRef])

	const onClickClose = useCallback<NonNullable<DeleteProps["onClick"]>>(
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
