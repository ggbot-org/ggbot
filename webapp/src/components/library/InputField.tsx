import { classNames } from "_/classNames"
import { stringMaxLength } from "@workspace/models"
import { FC, ReactNode, useId } from "react"
import { Control, ControlProps, Field, Help, Input, InputProps } from "trunx"

import { Label } from "./Label"

export type InputFieldProps = Pick<ControlProps, "isLoading"> &
	Omit<InputProps, "id"> & {
		help?: ReactNode
		label: string
	}

export const InputField: FC<InputFieldProps> = ({
	color,
	help,
	isLoading,
	readOnly,
	isStatic,
	label,
	type,
	...props
}) => {
	const id = useId()

	return (
		<Field>
			<Label htmlFor={id}>{label}</Label>

			<Control isLoading={isLoading}>
				<Input
					className={classNames({ "InputField--isStatic": isStatic })}
					id={id}
					color={color}
					readOnly={readOnly || isStatic}
					isStatic={isStatic}
					maxLength={type === "text" ? stringMaxLength : undefined}
					type={type}
					{...props}
				/>
			</Control>

			{help ? <Help color={color}>{help}</Help> : null}
		</Field>
	)
}
