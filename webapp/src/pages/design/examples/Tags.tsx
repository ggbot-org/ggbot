import { Tag, Tags } from "_/components/library"
import { FC } from "react"

export const TagsExample: FC = () => (
	<div>
		<Tags>
			<Tag>Tag</Tag>

			<Tag color="primary">Primary</Tag>

			<Tag color="light">Light</Tag>

			<Tag color="danger">Danger</Tag>
		</Tags>
	</div>
)
