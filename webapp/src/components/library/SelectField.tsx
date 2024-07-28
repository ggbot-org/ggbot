import { ReactNode, useId } from "react"
import { ColorProp, Control, Field, Help, Select, SelectProps } from "trunx"

import { Label } from "./Label"

// TODO update trunx then use color from SelectProps
type SelectFieldProps = ColorProp &
	Omit<SelectProps, "id"> & {
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
				<Select id={id} color={color} {...props} />
			</Control>

			{help ? <Help color={color}>{help}</Help> : null}
		</Field>
	)
}
