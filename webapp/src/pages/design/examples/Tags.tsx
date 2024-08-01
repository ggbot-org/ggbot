import { Tag, Tags } from "_/components/library"

export function TagsExample() {
	return (
		<div>
			<Tags>
				<Tag>Tag</Tag>

				<Tag color="primary">Primary</Tag>

				<Tag color="light">Light</Tag>

				<Tag color="danger">Danger</Tag>
			</Tags>
		</div>
	)
}
