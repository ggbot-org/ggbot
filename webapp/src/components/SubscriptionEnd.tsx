import { InputField, InputFieldProps } from "_/components/library"
import { dayFormat } from "_/i18n/formats.js"
import { Time } from "minimal-time-helpers"
import { FC } from "react"
import { useIntl } from "react-intl"

export type SubscriptionEndProps = Omit<InputFieldProps, "label" | "value"> & {
	value: Time | undefined
}

export const SubscriptionEnd: FC<SubscriptionEndProps> = ({
	value,
	...props
}) => {
	const { formatDate, formatMessage } = useIntl()

	return (
		<InputField
			label={formatMessage({ id: "SubscriptionEnd.label" })}
			value={formatDate(value, dayFormat)}
			{...props}
		/>
	)
}