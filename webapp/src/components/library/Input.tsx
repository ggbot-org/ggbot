import { classnames } from "_/classnames"
import { stringMaxLength } from "@workspace/models"
import { Input as _Input, InputProps as _InputProps } from "trunx"

export type InputProps = _InputProps &
	Partial<{
		isStatic: boolean
	}>

export function Input({
	autoComplete = "off",
	color,
	readOnly,
	isStatic,
	type,
	...props
}: InputProps) {
	return (
		<_Input
			autoComplete={autoComplete}
			className={classnames({
				"input--is-static": isStatic,
				"is-static": isStatic
			})}
			color={color}
			maxLength={type === "text" ? stringMaxLength : undefined}
			readOnly={readOnly || isStatic}
			type={type}
			{...props}
		/>
	)
}
