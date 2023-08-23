import { InputField, InputFieldProps } from "_/components/library"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label" | "readOnly">

export const StrategyKind: FC<Props> = ({ value, ...props }) => {
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
