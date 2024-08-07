import { ReactNode, useId } from "react"
import { Control, Field, Help } from "trunx"

import { Input, InputProps } from "./Input"
import { Label } from "./Label"

export type InputFieldProps = Omit<InputProps, "id"> & {
	label: ReactNode
} & Partial<{
	help: ReactNode
}>

export function InputField({ color, help, label, ...props }: InputFieldProps) {
	const id = useId()
	return (
		<Field>
			<Label htmlFor={id}>{label}</Label>
			<Control>
				<Input color={color} id={id} {...props} />
			</Control>
			{help ? <Help color={color}>{help}</Help> : null}
		</Field>
	)
}
