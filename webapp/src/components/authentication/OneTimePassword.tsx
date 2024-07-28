import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label">

export function OneTimePassword({ value, ...props }: Props) {
	const { formatMessage } = useIntl()

	return (
		<InputField
			label={formatMessage({ id: "OneTimePassword.label" })}
			value={value}
			{...props}
		/>
	)
}
