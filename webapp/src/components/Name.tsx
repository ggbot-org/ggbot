import { InputField, InputFieldProps } from "_/components/library"
import { isName, normalizeName } from "@workspace/models"
import {
	ChangeEventHandler,
	Dispatch,
	FC,
	InputHTMLAttributes,
	SetStateAction,
	useCallback
} from "react"
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

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			const { value } =
				event.target as unknown as InputHTMLAttributes<HTMLInputElement>
			if (typeof value === "string") setValue?.(value)
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
