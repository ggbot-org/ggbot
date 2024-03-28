import { FC, ReactNode, useId } from "react"
import { Control, Field, Help, Select, SelectProps } from "trunx"

import { Label } from "./Label"

type SelectFieldProps = Omit<SelectProps, "id"> & {
	help?: ReactNode
	label: string
}

export const SelectField: FC<SelectFieldProps> = ({
	color,
	help,
	label,
	...props
}) => {
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
