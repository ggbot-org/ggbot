import { InputField, InputFieldProps } from "_/components/library"
import { dayFormat } from "_/i18n/formats"
import { Time } from "minimal-time-helpers"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<
	InputFieldProps,
	"label" | "defaultValue" | "value" | "isStatic"
> & {
	value: Time | undefined
}

export const WhenCreated: FC<Props> = ({ value, ...props }) => {
	const { formatDate, formatMessage } = useIntl()

	return (
		<InputField
			isStatic
			label={formatMessage({ id: "WhenCreated.label" })}
			defaultValue={value ? formatDate(value, dayFormat) : ""}
			{...props}
		/>
	)
}
