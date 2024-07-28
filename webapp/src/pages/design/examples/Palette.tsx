import { classnames } from "_/classnames"
import { Column, Columns } from "_/components/library"

export function Palette() {
	return (
		<Columns>
			<Column className={classnames("has-background-white")}>
				white
			</Column>

			<Column
				className={classnames(
					"has-background-grey",
					"has-text-primary"
				)}
			>
				grey
			</Column>

			<Column
				className={classnames(
					"has-background-primary",
					"has-text-grey"
				)}
			>
				primary
			</Column>

			<Column
				className={classnames(
					"has-background-warning",
					"has-text-black"
				)}
			>
				warning
			</Column>

			<Column
				className={classnames(
					"has-background-black",
					"has-text-warning"
				)}
			>
				black
			</Column>

			<Column
				className={classnames(
					"has-background-danger",
					"has-text-success"
				)}
			>
				danger
			</Column>

			<Column
				className={classnames(
					"has-background-success",
					"has-text-danger"
				)}
			>
				success
			</Column>
		</Columns>
	)
}
