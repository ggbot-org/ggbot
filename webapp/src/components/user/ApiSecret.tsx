import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label">

export function ApiSecret(props: Props) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			label={formatMessage({ id: "ApiSecret.label" })}
			{...props}
		/>
	)
}
