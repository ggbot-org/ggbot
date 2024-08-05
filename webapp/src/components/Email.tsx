import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label" | "type" | "defaultValue">

export function Email({ isStatic, value, ...props }: Props) {
	const { formatMessage } = useIntl()

	return (
		<InputField
			isStatic={isStatic}
			label={formatMessage({ id: "Email.label" })}
			readOnly={isStatic}
			type={isStatic ? "text" : "email"}
			value={value}
			{...props}
		/>
	)
}
