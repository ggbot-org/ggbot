import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

export function Email({
	isStatic, value, ...props
}: Omit<InputFieldProps, "label" | "type" | "defaultValue">) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			isStatic={isStatic}
			label={formatMessage({ id: "Email.label" })}
			readOnly={isStatic}
			type={isStatic ? "text" : "email"}
			value={value}
			{...props}
		/>
	)
}
