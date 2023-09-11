import {
	InputField,
	InputFieldProps,
	InputOnChange
} from "_/components/library"
import { isName, normalizeName } from "@workspace/models"
import { Dispatch, FC, SetStateAction, useCallback } from "react"
import { useIntl } from "react-intl"

export type NameProps = Omit<InputFieldProps, "color" | "help" | "type"> &
	Partial<{
		setValue: Dispatch<SetStateAction<string>>
	}>

export const Name: FC<NameProps> = ({
	isStatic,
	readOnly,
	setValue,
	value,
	...props
}) => {
	const { formatMessage } = useIntl()

	const name = typeof value === "string" ? value : ""

	const onChange = useCallback<InputOnChange>(
		(event) => {
			setValue?.(event.target.value)
		},
		[setValue]
	)

	let color: InputFieldProps["color"] = undefined
	let help = ""

	if (name.length > 0) {
		if (name !== normalizeName(name)) {
			help = formatMessage({ id: "Name.hasSpaces" })
			color = "warning"
		}
		if (!isName(name)) {
			help = formatMessage({ id: "Name.invalid" })
			color = "danger"
		}
	}

	return (
		<InputField
			color={color}
			help={help}
			isStatic={isStatic}
			onChange={isStatic ? undefined : setValue ? onChange : undefined}
			readOnly={readOnly}
			spellCheck="false"
			type="text"
			defaultValue={isStatic ? value : undefined}
			value={isStatic ? undefined : value}
			{...props}
		/>
	)
}
