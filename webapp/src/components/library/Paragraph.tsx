import { classNames } from "_/classNames"
import { FC, PropsWithChildren } from "react"

export const Paragraph: FC<PropsWithChildren> = ({ children }) => (
	<p className={classNames("Paragraph")}>{children}</p>
)
