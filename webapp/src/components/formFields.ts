export type FormField = {
	apiKey: { value: string }
	apiSecret: { value: string }
	code: { value: string }
	name: { value: string }
	numMonths: { value: number }
	email: { value: string }
}

export type FormFieldName = keyof FormField
