import { logging } from "@workspace/logging"

const { info: _info, warn: _warn } = logging("binance-proxy")
export const info = _info
export const warn = _warn
