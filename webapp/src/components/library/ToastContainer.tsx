import { classnames } from "_/classnames"
import { PropsWithChildren } from "react"

export function ToastContainer({ children }: PropsWithChildren) {
	return <div className={classnames("toast-container")}>{children}</div>
}
