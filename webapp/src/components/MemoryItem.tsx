import { classnames } from "_/classnames"
import { SerializablePrimitive } from "@workspace/models"

export type MemoryItemProps = {
	name: string
	value: SerializablePrimitive | undefined
}

export function MemoryItem({ name, value }: MemoryItemProps) {
	const formattedValue = value === undefined ? "" : JSON.stringify(value, null, 2)
	return (
		<div className={classnames("is-flex", "is-flex-direction-column", "my-1", "is-flex-grow-1")}>
			<span>{name}</span>
			<pre className={classnames("p-2")}>
				<code>{formattedValue}</code>
			</pre>
		</div>
	)
}
