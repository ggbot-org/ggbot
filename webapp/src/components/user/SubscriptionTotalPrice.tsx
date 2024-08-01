import { InputField } from "_/components/library"
import { useIntl } from "react-intl"

type Props = {
	currency: string
	monthlyPrice: number
	numMonths: number | undefined
}

export function SubscriptionTotalPrice({
	currency,
	monthlyPrice,
	numMonths
}: Props) {
	const { formatMessage, formatNumber } = useIntl()
	return (
		<InputField
			isStatic
			readOnly
			label={formatMessage({ id: "SubscriptionTotalPrice.label" })}
			value={
				numMonths
					? formatNumber(monthlyPrice * numMonths, {
							style: "currency",
							currency
						})
					: ""
			}
		/>
	)
}
