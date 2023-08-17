import {
	createContext,
	FC,
	PropsWithChildren,
	Reducer,
	useCallback,
	useMemo,
	useReducer
} from "react"
import { Notification } from "trunx"

import { classNames } from "../components/classNames.js"
import { Toast, ToastProps } from "../components/Toast.js"

type CreateToast = (message: ToastProps["message"]) => void

type ContextValue = {
	toast: Record<ToastProps["color"], CreateToast>
}

export const ToastContext = createContext<ContextValue>({
	toast: {
		info: () => {},
		danger: () => {},
		warning: () => {}
	}
})

ToastContext.displayName = "ToastContext"

type Notification = {
	id: number
	toast: Omit<ToastProps, "close">
}

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
	const [notifications, dispatch] = useReducer<
		Reducer<
			Notification[],
			| { type: "ADD_NOTIFICATION"; notification: Notification }
			| ({ type: "REMOVE_NOTIFICATION" } & Pick<Notification, "id">)
		>
	>((notifications, action) => {
		switch (action.type) {
			case "ADD_NOTIFICATION":
				// Add new notification at the beginning of the stack.
				// They are displayed on bottom, so new notifications will be on top.
				return [action.notification, ...notifications]

			case "REMOVE_NOTIFICATION":
				return notifications.filter(({ id }) => id !== action.id)

			default:
				return notifications
		}
	}, [])

	const close = useCallback<(id: Notification["id"]) => () => void>(
		(id) => () => {
			dispatch({ type: "REMOVE_NOTIFICATION", id })
		},
		[]
	)

	const contextValue = useMemo<ContextValue>(() => {
		const toast: (color: ToastProps["color"]) => CreateToast =
			(color) => (message) => {
				const id = Date.now()
				dispatch({
					type: "ADD_NOTIFICATION",
					notification: { id, toast: { color, message } }
				})
			}

		return {
			toast: {
				info: toast("info"),
				danger: toast("danger"),
				warning: toast("warning")
			}
		}
	}, [])

	return (
		<ToastContext.Provider value={contextValue}>
			{children}

			<div className={classNames("ToastContainer")}>
				{notifications.map(({ id, toast: { message, color } }) => (
					<Toast
						key={id}
						color={color}
						close={close(id)}
						message={message}
					/>
				))}
			</div>
		</ToastContext.Provider>
	)
}
