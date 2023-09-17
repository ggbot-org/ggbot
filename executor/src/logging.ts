import { pid } from "node:process"

import { isDev } from "@workspace/env"
import { logging } from "@workspace/logging"

const log = logging(`executor ${pid}`, isDev)

export const info = log.info
export const warn = log.warn
