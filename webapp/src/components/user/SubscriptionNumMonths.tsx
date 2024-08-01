import { InputField, InputFieldProps } from "_/components/library"
import {
	purchaseMaxNumMonths as max,
	purchaseMinNumMonths as min
} from "@workspace/models"
import {
	ChangeEventHandler,
	Dispatch,
	InputHTMLAttributes,
	SetStateAction,
	useCallback
} from "react"
import { useIntl } from "react-intl"

type Props = Omit<
	InputFieldProps,
	"label" | "min" | "max" | "onChange" | "step" | "type"
> & {
	isYearlyPurchase: boolean | undefined
	setValue: Dispatch<SetStateAction<number | undefined>>
}

export function SubscriptionNumMonths({
	isYearlyPurchase,
	setValue,
	value,
	...props
}: Props) {
	const { formatMessage } = useIntl()

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			const { value } =
				event.target as unknown as InputHTMLAttributes<HTMLInputElement>
			const num = Number(value)
			if (value === "" || isNaN(num)) {
				setValue(undefined)
				return
			}
			if (num < min) setValue(min)
			if (num >= min && num <= max) setValue(num)
			if (num > max) setValue(max)
		},
		[setValue]
	)

	return (
		<InputField
			label={formatMessage({ id: "SubscriptionNumMonths.label" })}
			color={isYearlyPurchase ? "primary" : undefined}
			onChange={onChange}
			min={min}
			max={max}
			step={1}
			type="number"
			value={value}
			{...props}
		/>
	)
}
