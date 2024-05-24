import { classNames } from "_/classNames"
import { Flex } from "_/components/library"
import { SerializablePrimitive } from "@workspace/models"

export type MemoryItemProps = {
	name: string
	value: SerializablePrimitive | undefined
}

export function MemoryItem({ name, value }: MemoryItemProps) {
	const formattedValue =
		value === undefined ? "" : JSON.stringify(value, null, 2)

	return (
		<Flex grow={1} spacing={{ my: 1 }} direction="column">
			<span>{name}</span>

			<pre className={classNames("p-2")}>
				<code>{formattedValue}</code>
			</pre>
		</Flex>
	)
}
