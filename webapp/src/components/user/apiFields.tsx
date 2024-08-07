
import { FormFieldName } from "_/components/formFields"
import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

function truncateApiKey(apiKey: string | undefined): string {
	if (!apiKey) return ""
	return `${apiKey.substring(0, 10)}...${ apiKey.substring(apiKey.length - 10, apiKey.length) }`
}

export function ApiKey({ isStatic, value, ...props }: Omit<
	InputFieldProps, "label" | "defaultValue" | "name" | "value"
> & { value?: string | undefined }) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			defaultValue={isStatic ? truncateApiKey(value) : undefined}
			label={formatMessage({ id: "ApiKey.label" })}
			name={"apiKey" satisfies FormFieldName}
			value={isStatic ? undefined : value}
			{...props}
		/>
	)
}

export function ApiSecret(props: Omit<InputFieldProps, "label" | "name">) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			label={formatMessage({ id: "ApiSecret.label" })}
			name={"apiSecret" satisfies FormFieldName}
			{...props}
		/>
	)
}
