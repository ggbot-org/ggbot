import { InputField, InputFieldProps } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function Email({
	value, ...props
}: Omit<InputFieldProps, "isStatic" | "label" | "type" | "defaultValue">) {
	return (
		<InputField
			label={<FormattedMessage id="Email.label" />}
			type="email"
			value={value}
			{...props}
		/>
	)
}
