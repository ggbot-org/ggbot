import { classNames } from "_/classNames"
import { FC } from "react"
import { Column, ColumnProps } from "trunx"

type Props = Omit<ColumnProps, "size">

export const OneColumn: FC<Props> = ({ children, ...props }) => (
	<Column className={classNames("OneColumn")} {...props}>
		{children}
	</Column>
)
