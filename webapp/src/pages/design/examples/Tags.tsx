import { Tag } from "_/components/library"
import { FC } from "react"

export const Tags: FC = () => (
	<div>
		<div>
			<Tag>pill</Tag>
		</div>

		<div>
			<Tag color="primary">Primary</Tag>
		</div>

		<div>
			<Tag color="light">Light</Tag>
		</div>

		<div>
			<Tag color="danger">Danger</Tag>
		</div>

		<div>
			<span>Grouped tags</span>

			<div>
				<Tag>Tag</Tag>

				<Tag color="primary">Primary</Tag>

				<Tag color="light">Light</Tag>
			</div>
		</div>
	</div>
)
