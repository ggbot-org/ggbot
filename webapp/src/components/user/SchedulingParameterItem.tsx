import { Flex, InputField } from "_/components/library"
import { SerializablePrimitive } from "@workspace/models"
import { FC } from "react"

export type SchedulingParameterItemProps = {
	label: string
	defaultValue?: SerializablePrimitive
	value: SerializablePrimitive | undefined
}

export const SchedulingParameterItem: FC<SchedulingParameterItemProps> = ({
	defaultValue,
	label,
	value = ""
}) => (
	<Flex grow={1} spacing={{ my: 1 }} direction="column">
		<InputField
			placeholder={String(defaultValue ?? "")}
			label={label}
			defaultValue={String(value ?? "")}
		/>
	</Flex>
)
