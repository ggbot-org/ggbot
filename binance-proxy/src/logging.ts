import { isDev } from "@workspace/env"
import { logging } from "@workspace/logging"

const { info: _info, warn: _warn } = logging("binance-proxy", isDev)
export const info = _info
export const warn = _warn
