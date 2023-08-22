import { InputField, InputFieldProps } from "@ggbot2/design"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "label">

export const SubscriptionPlan: FC<Props> = (props) => {
	const { formatMessage } = useIntl()

	return (
		<InputField
			readOnly
			label={formatMessage({ id: "SubscriptionPlan.label" })}
			{...props}
		/>
	)
}
