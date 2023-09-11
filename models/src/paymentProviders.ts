import { isLiteralType } from "@workspace/type-utils"

const paymentProviders = ["utrust"]
export type PaymentProvider = (typeof paymentProviders)[number]
export const isPaymentProvider =
	isLiteralType<PaymentProvider>(paymentProviders)
