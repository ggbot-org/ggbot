import { Classname } from '_/classnames'
import { PropsWithChildren } from 'react'

export function ToastContainer({ children }: PropsWithChildren) {
	return <div className={'toast-container' satisfies Classname}>{children}</div>
}
