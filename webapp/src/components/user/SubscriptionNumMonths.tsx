import { InputField, InputFieldProps } from "_/components/library"
import { purchaseMaxNumMonths as max, purchaseMinNumMonths as min } from "@workspace/models"
import { useIntl } from "react-intl"

export function SubscriptionNumMonths({
	isYearlyPurchase, setValue, value, ...props
}: Omit<
	InputFieldProps,
	"label" | "min" | "max" | "onChange" | "step" | "type"
> & {
	isYearlyPurchase: boolean | undefined
	setValue: (value: number | undefined) => void
}) {
	const { formatMessage } = useIntl()
	return (
		<InputField
			color={isYearlyPurchase ? "primary" : undefined}
			label={formatMessage({ id: "SubscriptionNumMonths.label" })}
			max={max}
			min={min}
			onChange={(event) => {
				const value = event.target.value as string
				const num = Number(value)
				if (value === "" || isNaN(num)) {
					setValue(undefined)
					return
				}
				if (num < min) setValue(min)
				if (num >= min && num <= max) setValue(num)
				if (num > max) setValue(max)
			}}
			step={1}
			type="number"
			value={value}
			{...props}
		/>
	)
}
