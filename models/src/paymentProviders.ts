const paymentProviders = ["stripe"] as const
export type PaymentProvider = (typeof paymentProviders)[number]
