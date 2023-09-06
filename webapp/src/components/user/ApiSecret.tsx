import { InputField, InputFieldProps } from "_/components/library"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label">

export const ApiSecret: FC<Props> = (props) => {
	const { formatMessage } = useIntl()

	return (
		<InputField
			label={formatMessage({ id: "ApiSecret.label" })}
			{...props}
		/>
	)
}
