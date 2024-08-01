import { Icon, iconNames } from "_/components/library"

export function Icons() {
	return (
		<div>
			{iconNames.map((name) => (
				<Icon key={name} name={name} />
			))}
		</div>
	)
}
