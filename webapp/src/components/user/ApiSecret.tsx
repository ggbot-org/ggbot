import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

export function ApiSecret(props: Omit<InputFieldProps, "label">) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			label={formatMessage({ id: "ApiSecret.label" })}
			{...props}
		/>
	)
}
