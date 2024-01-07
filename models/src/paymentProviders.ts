import { isLiteralType } from "minimal-type-guard-helpers"

const paymentProviders = ["stripe"] as const
export type PaymentProvider = (typeof paymentProviders)[number]
export const isPaymentProvider =
	isLiteralType<PaymentProvider>(paymentProviders)
