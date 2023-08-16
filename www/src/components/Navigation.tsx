import { BrandName, Logo } from "@ggbot2/design"
import { FC } from "react"

export const Navigation: FC = () => (
	<div>
		<a href="/">
			<Logo size={24} />

			<BrandName />
		</a>

		<em>crypto flow</em>
	</div>
)
