import { isDev } from "@ggbot2/env"
import { logging } from "@workspace/logging"

export const info = logging("binance-proxy", isDev).info
