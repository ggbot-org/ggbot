import { InputField, InputFieldProps } from "_/components/library"
import { SubscriptionPlan as SubscriptionValue } from "@workspace/models"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label" | "value"> &
	Partial<{
		value: SubscriptionValue
	}>

export const SubscriptionPlan: FC<Props> = ({ value, ...props }) => {
	const { formatMessage } = useIntl()

	if (!value) return null

	return (
		<InputField
			readOnly
			label={formatMessage({ id: "SubscriptionPlan.label" })}
			value={formatMessage({ id: `SubscriptionPlan.${value}` })}
			{...props}
		/>
	)
}
