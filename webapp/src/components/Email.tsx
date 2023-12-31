import { InputField, InputFieldProps } from "_/components/library"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label" | "type" | "defaultValue">

export const Email: FC<Props> = ({ isStatic, value, ...props }) => {
	const { formatMessage } = useIntl()

	return (
		<InputField
			type={isStatic ? "text" : "email"}
			label={formatMessage({ id: "Email.label" })}
			isStatic={isStatic}
			readOnly={isStatic}
			value={value}
			{...props}
		/>
	)
}
