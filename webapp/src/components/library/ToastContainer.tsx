import { classNames } from "_/classNames"
import { FC, PropsWithChildren } from "react"

export const ToastContainer: FC<PropsWithChildren> = ({ children }) => (
	<div className={classNames("ToastContainer")}>{children}</div>
)
