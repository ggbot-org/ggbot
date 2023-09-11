import { isDev } from "@workspace/env"
import { logging } from "@workspace/logging"

export const info = logging("binance-proxy", isDev).info
