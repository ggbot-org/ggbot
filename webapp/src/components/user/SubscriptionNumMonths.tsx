import { InputField, InputFieldProps } from "_/components/library"
import {
	purchaseMaxNumMonths as max,
	purchaseMinNumMonths as min
} from "@workspace/models"
import {
	ChangeEventHandler,
	Dispatch,
	FC,
	InputHTMLAttributes,
	SetStateAction,
	useCallback
} from "react"
import { useIntl } from "react-intl"

type Props = Omit<
	InputFieldProps,
	"label" | "min" | "max" | "onChange" | "step" | "type"
> & {
	setValue: Dispatch<SetStateAction<number | undefined>>
}

export const SubscriptionNumMonths: FC<Props> = ({
	setValue,
	value,
	...props
}) => {
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
