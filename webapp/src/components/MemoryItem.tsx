import { classNames } from "_/classNames"
import { Flex } from "_/components/library"
import { SerializablePrimitive } from "@workspace/models"
import { FC } from "react"

export type MemoryItemProps = {
	name: string
	value: SerializablePrimitive | undefined
}

export const MemoryItem: FC<MemoryItemProps> = ({ name, value }) => {
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
