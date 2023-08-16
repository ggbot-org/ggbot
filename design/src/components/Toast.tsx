import { FC, ReactNode, useCallback, useEffect, useRef } from "react"
import {
	ButtonDelete,
	ButtonDeleteProps,
	Notification,
	NotificationProps
} from "trunx"

import { _classNames } from "../components/_classNames.js"

export type ToastProps = {
	close: () => void
	color: Extract<NotificationProps["color"], "info" | "danger" | "warning">
	message: ReactNode
	timeout?: number
}

export const Toast: FC<ToastProps> = ({ close, color, message }) => {
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

	const onClickClose = useCallback<NonNullable<ButtonDeleteProps["onClick"]>>(
		(event) => {
			event.stopPropagation()
			close()
		},
		[close]
	)

	return (
		<Notification color={color} onClick={onClickMessage}>
			<ButtonDelete size="small" onClick={onClickClose} />

			{message}
		</Notification>
	)
}
