import { classnames } from "_/classnames"
import { PropsWithChildren } from "react"
import { Column } from "trunx"

export function OneColumn({ children }: PropsWithChildren) {
	return <Column className={classnames("one-column")}>{children}</Column>
}
