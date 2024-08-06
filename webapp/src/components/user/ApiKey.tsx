import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

function truncateApiKey(apiKey: string | undefined): string {
	if (!apiKey) return ""
	return `${apiKey.substring(0, 10)}...${ apiKey.substring(apiKey.length - 10, apiKey.length) }`
}

export function ApiKey({
	isStatic, value, ...props
}: Omit<
	InputFieldProps, "label" | "defaultValue" | "value"
> & { value?: string | undefined }) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			defaultValue={isStatic ? truncateApiKey(value) : undefined}
			label={formatMessage({ id: "ApiKey.label" })}
			value={isStatic ? undefined : value}
			{...props}
		/>
	)
}
