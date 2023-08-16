import { Icon, iconNames } from "@ggbot2/design"
import { FC } from "react"

export const Icons: FC = () => (
	<div>
		{iconNames.map((name) => (
			<Icon key={name} name={name} />
		))}
	</div>
)
