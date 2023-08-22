import { InputField, InputFieldProps } from "@ggbot2/design"
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
			value={isStatic ? undefined : value}
			defaultValue={isStatic ? value : undefined}
			{...props}
		/>
	)
}
