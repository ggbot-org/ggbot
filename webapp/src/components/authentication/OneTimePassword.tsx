import { InputField, InputFieldProps } from "_/components/library"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label">

export const OneTimePassword: FC<Props> = ({ value, ...props }) => {
	const { formatMessage } = useIntl()

	return (
		<InputField
			label={formatMessage({ id: "OneTimePassword.label" })}
			value={value}
			{...props}
		/>
	)
}
