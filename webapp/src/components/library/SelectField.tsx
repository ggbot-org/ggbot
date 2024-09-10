import { ReactNode, useId } from "react"
import { Control, Field, Help, Select, SelectProps } from "trunx"

import { Label } from "./Label"

type SelectFieldProps = Omit<SelectProps, "id"> & {
	help?: ReactNode
	label: string
}

export function SelectField({
	color,
	help,
	label,
	...props
}: SelectFieldProps) {
	const id = useId()
	return (
		<Field>
			<Label htmlFor={id}>{label}</Label>
			<Control>
				<Select color={color} id={id} {...props} />
			</Control>
			{help ? <Help color={color}>{help}</Help> : null}
		</Field>
	)
}
