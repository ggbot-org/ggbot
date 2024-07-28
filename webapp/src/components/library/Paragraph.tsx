import { classnames } from "_/classnames"
import { PropsWithChildren } from "react"

export function Paragraph({ children }: PropsWithChildren) {
	return <p className={classnames("Paragraph")}>{children}</p>
}
