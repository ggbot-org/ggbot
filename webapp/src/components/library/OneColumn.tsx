import { classnames } from "_/classnames"
import { PropsWithChildren } from "react"
import { Column, Columns } from "trunx"

export function OneColumn({ children }: PropsWithChildren) {
	return (
		<Columns>
			<Column className={classnames("one-column")}>{children}</Column>
		</Columns>
	)
}
