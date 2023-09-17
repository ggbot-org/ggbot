import { ENV } from "@workspace/env"

import { ErrorCannotParseStaticIps } from "./errors.js"

const looksLikeIp = (ip: unknown) => typeof ip === "string"

export const parseStaticIps = () => {
	const staticIps = ENV.BINANCE_PROXY_STATIC_IPS().split(",")
	if (Array.isArray(staticIps) && staticIps.every(looksLikeIp))
		return staticIps
	throw new ErrorCannotParseStaticIps()
}
