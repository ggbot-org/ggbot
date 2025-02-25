// Can cast `apiKey` and `apiSecret` as strings;
// if thet are not defined, an error is thrown.
export const apiKey = process.env.BINANCE_API_KEY as string
export const apiSecret = process.env.BINANCE_API_SECRET as string

if (!apiKey || !apiSecret)
	throw new Error(
		'Set both BINANCE_API_KEY and BINANCE_API_SECRET environment variables'
	)
