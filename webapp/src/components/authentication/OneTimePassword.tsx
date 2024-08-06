import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

export function OneTimePassword(props: Pick<InputFieldProps, "required" | "name" | "readOnly">) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			label={formatMessage({ id: "OneTimePassword.label" })}
			{...props}
		/>
	)
}
