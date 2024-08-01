import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Pick<InputFieldProps, "required" | "name" | "readOnly">

export function OneTimePassword(props: Props) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			label={formatMessage({ id: "OneTimePassword.label" })}
			{...props}
		/>
	)
}
