import { InputField } from "_/components/library"
import { purchaseCurrency, totalPurchase } from "@workspace/models"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = {
	numMonths: number | undefined
}

export const SubscriptionTotalPrice: FC<Props> = ({ numMonths }) => {
	const { formatMessage, formatNumber } = useIntl()

	return (
		<InputField
			isStatic
			readOnly
			label={formatMessage({ id: "SubscriptionTotalPrice.label" })}
			value={
				numMonths
					? formatNumber(totalPurchase(numMonths), {
							style: "currency",
							currency: purchaseCurrency
					  })
					: ""
			}
		/>
	)
}
