import { InputField, InputFieldProps } from "_/components/library"
import { FormattedMessage } from "react-intl"

// TODO add Email to readonly fields
// the dynamic one is used only for AuthEnter
export function Email({
	isStatic, value, ...props
}: Omit<InputFieldProps, "label" | "type" | "defaultValue">) {
	return (
		<InputField
			isStatic={isStatic}
			label={<FormattedMessage id="Email.label" />}
			readOnly={isStatic}
			type={isStatic ? "text" : "email"}
			value={value}
			{...props}
		/>
	)
}
