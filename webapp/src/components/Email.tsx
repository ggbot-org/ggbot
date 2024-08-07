import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

// TODO add Email to readonly fields
// the dynamic one is used only for AuthEnter
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
