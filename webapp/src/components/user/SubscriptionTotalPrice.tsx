import { InputField } from "_/components/library"
import { totalPurchase } from "@workspace/models"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = {
	currency: string
	monthlyPrice: number
	numMonths: number | undefined
}

export const SubscriptionTotalPrice: FC<Props> = ({
	currency,
	monthlyPrice,
	numMonths
}) => {
	const { formatMessage, formatNumber } = useIntl()

	return (
		<InputField
			isStatic
			readOnly
			label={formatMessage({ id: "SubscriptionTotalPrice.label" })}
			value={
				numMonths
					? formatNumber(totalPurchase(monthlyPrice, numMonths), {
							style: "currency",
							currency
					  })
					: ""
			}
		/>
	)
}
