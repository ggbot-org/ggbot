import { InputField, InputFieldProps } from "_/components/library"
import { isName, normalizeName } from "@workspace/models"
import { ChangeEventHandler, Dispatch, SetStateAction, useCallback } from "react"
import { useIntl } from "react-intl"

export type NameProps = Omit<InputFieldProps, "color" | "help" | "type"> &
	Partial<{
		setValue: Dispatch<SetStateAction<string>>
	}>

export function Name({ isStatic, readOnly, setValue, value, ...props }: NameProps) {
	const { formatMessage } = useIntl()

	const name = typeof value === "string" ? value : ""

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => setValue?.(event.target.value),
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
			defaultValue={isStatic ? value : undefined}
			help={help}
			isStatic={isStatic}
			onChange={isStatic ? undefined : setValue ? onChange : undefined}
			readOnly={readOnly}
			spellCheck="false"
			type="text"
			value={isStatic ? undefined : value}
			{...props}
		/>
	)
}
