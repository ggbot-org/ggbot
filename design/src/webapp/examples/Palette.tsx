import { classNames, Column, Columns } from "@ggbot2/design"
import { FC } from "react"

export const Palette: FC = () => (
	<Columns>
		<Column className={classNames("has-background-white")}>white</Column>

		<Column
			className={classNames("has-background-grey", "has-text-primary")}
		>
			grey
		</Column>

		<Column
			className={classNames("has-background-primary", "has-text-grey")}
		>
			primary
		</Column>

		<Column
			className={classNames("has-background-warning", "has-text-black")}
		>
			warning
		</Column>

		<Column
			className={classNames("has-background-black", "has-text-warning")}
		>
			black
		</Column>

		<Column
			className={classNames("has-background-danger", "has-text-success")}
		>
			danger
		</Column>

		<Column
			className={classNames("has-background-success", "has-text-danger")}
		>
			success
		</Column>
	</Columns>
)
