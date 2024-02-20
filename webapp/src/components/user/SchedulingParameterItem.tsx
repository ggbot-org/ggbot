import { InputField } from "_/components/library"
import { SerializablePrimitive } from "@workspace/models"
import { IdentifierString } from "@workspace/models"
import { FC, FocusEventHandler, useCallback } from "react"

export type SchedulingParameterItemProps = {
	label: string
	defaultValue?: SerializablePrimitive
	value: SerializablePrimitive | undefined
	setParam: (
		key: IdentifierString,
		value: SerializablePrimitive | undefined
	) => void
}

export const SchedulingParameterItem: FC<SchedulingParameterItemProps> = ({
	defaultValue,
	label,
	value = "",
	setParam
}) => {
	const onBlur = useCallback<
		FocusEventHandler<
			HTMLInputElement & { value: SchedulingParameterItemProps["value"] }
		>
	>(
		(event) => {
			setParam(label, event.target.value)
		},
		[label, setParam]
	)

	return (
		<InputField
			onBlur={onBlur}
			placeholder={String(defaultValue ?? "")}
			label={label}
			defaultValue={String(value ?? "")}
		/>
	)
}
