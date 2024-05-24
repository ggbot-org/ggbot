import { InputField, InputFieldProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label" | "readOnly">

export function StrategyKind({ value, ...props }: Props) {
	const { formatMessage } = useIntl()

	return (
		<InputField
			readOnly
			label={formatMessage({ id: "StrategyKind.label" })}
			value={value}
			{...props}
		/>
	)
}
