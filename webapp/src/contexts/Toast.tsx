import { Toast, ToastContainer, ToastProps } from '_/components/library'
import {
	createContext,
	PropsWithChildren,
	ReactNode,
	useCallback,
	useMemo,
	useReducer,
} from 'react'

type ContextValue = {
	toast: Record<ToastProps['color'], (message: ToastProps['message']) => void>
}

export const ToastContext = createContext<ContextValue>({
	toast: {
		info: () => {
			/* do nothing */
		},
		danger: () => {
			/* do nothing */
		},
		warning: () => {
			/* do nothing */
		},
	},
})

ToastContext.displayName = 'ToastContext'

type Notification = {
	id: number
	toast: Omit<ToastProps, 'close'>
}

type Action =
	| { type: 'ADD_NOTIFICATION'; notification: Notification }
	| ({ type: 'REMOVE_NOTIFICATION' } & Pick<Notification, 'id'>)

export function ToastProvider({ children }: PropsWithChildren) {
	const [notifications, dispatch] = useReducer<Notification[], [any]>(
		(notifications, action: Action) => {
			// Add new notification at the beginning of the stack.
			// They are displayed on bottom, so new notifications will be on top.
			if (action.type === 'ADD_NOTIFICATION')
				return [action.notification, ...notifications]

			if (action.type === 'REMOVE_NOTIFICATION')
				return notifications.filter(({ id }) => id !== action.id)

			return notifications
		},
		[]
	)

	const close = useCallback<(id: Notification['id']) => () => void>(
		(id) => () => {
			dispatch({ type: 'REMOVE_NOTIFICATION', id })
		},
		[]
	)

	const contextValue = useMemo<ContextValue>(() => {
		function notify({ color, message }: Pick<ToastProps, 'color' | 'message'>) {
			dispatch({
				type: 'ADD_NOTIFICATION',
				notification: {
					id: Date.now(),
					toast: { color, message },
				},
			})
		}
		return {
			toast: {
				info(message: ReactNode) {
					notify({ color: 'info', message })
				},
				danger(message: ReactNode) {
					notify({ color: 'danger', message })
				},
				warning(message: ReactNode) {
					notify({ color: 'warning', message })
				},
			},
		}
	}, [])

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
			<ToastContainer>
				{notifications.map(({ id, toast: { message, color } }) => (
					<Toast key={id} close={close(id)} color={color} message={message} />
				))}
			</ToastContainer>
		</ToastContext.Provider>
	)
}
