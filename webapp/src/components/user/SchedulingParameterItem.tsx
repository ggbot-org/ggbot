import { classNames } from "_/classNames"
import { Flex } from "_/components/library"
import { SerializablePrimitive } from "@workspace/models"
import { FC } from "react"

export type SchedulingParameterItemProps = {
	name: string
	value: SerializablePrimitive | undefined
}

export const SchedulingParameterItem: FC<SchedulingParameterItemProps> = ({
	name,
	value = ""
}) => (
		<Flex grow={1} spacing={{ my: 1 }} direction="column">
			<span>{name}</span>

			<pre className={classNames("p-2")}>
				<code>{value}</code>
			</pre>
		</Flex>
	)
