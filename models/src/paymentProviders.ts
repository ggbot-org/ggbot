import { isLiteralType } from "@ggbot2/type-utils"

const paymentProviders = ["utrust"]
export type PaymentProvider = (typeof paymentProviders)[number]
export const isPaymentProvider =
	isLiteralType<PaymentProvider>(paymentProviders)
