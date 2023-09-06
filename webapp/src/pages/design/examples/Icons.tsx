import { Icon, iconNames } from "_/components/library"
import { FC } from "react"

export const Icons: FC = () => (
	<div>
		{iconNames.map((name) => (
			<Icon key={name} name={name} />
		))}
	</div>
)
