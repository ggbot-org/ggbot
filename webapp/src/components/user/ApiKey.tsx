import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label" | "defaultValue">

function truncateApiKey(apiKey: InputFieldProps["value"]) {
	return typeof apiKey === "string"
		? `${apiKey.substring(0, 10)}...${apiKey.substring(
			apiKey.length - 10,
			apiKey.length
		)}`
		: ""
}

export function ApiKey({ isStatic, value, ...props }: Props) {
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
