import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<
	InputFieldProps,
	"label" | "isStatic" | "defaultValue" | "onChange"
>

export function AccountId({ value, ...props }: Props) {
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
