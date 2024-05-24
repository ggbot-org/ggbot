import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label" | "type" | "defaultValue">

export function Email({ isStatic, value, ...props }: Props) {
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
