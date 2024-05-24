import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<
	InputFieldProps,
	"label" | "readOnly" | "isStatic" | "defaultValue"
>

export function StrategyId({ value, ...props }: Props) {
	const { formatMessage } = useIntl()

	return (
		<InputField
			readOnly
			isStatic
			label={formatMessage({ id: "StrategyId.label" })}
			defaultValue={value}
			{...props}
		/>
	)
}
