import { classNames } from "_/classNames"
import { stringMaxLength } from "@workspace/models"
import { FC } from "react"
import { Input as _Input, InputProps } from "trunx"

export type { InputProps } from "trunx"

export const Input: FC<InputProps> = ({
	color,
	readOnly,
	isStatic,
	type,
	...props
}) => (
	<_Input
		className={classNames({ "Input--isStatic": isStatic })}
		color={color}
		readOnly={readOnly || isStatic}
		isStatic={isStatic}
		maxLength={type === "text" ? stringMaxLength : undefined}
		type={type}
		{...props}
	/>
)
