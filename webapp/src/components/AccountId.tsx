import { InputField, InputFieldProps } from "_/components/library"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<
	InputFieldProps,
	"label" | "isStatic" | "defaultValue" | "onChange"
>

export const AccountId: FC<Props> = ({ value, ...props }) => {
	const { formatMessage } = useIntl()

	return (
		<InputField
			isStatic
			label={formatMessage({ id: "AccountId.label" })}
			defaultValue={value}
			{...props}
		/>
	)
}
