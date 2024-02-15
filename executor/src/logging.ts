import { pid } from "node:process"

import { logging } from "@workspace/logging"

const log = logging(`executor ${pid}`)

export const info = log.info
export const warn = log.warn
export const debug = log.debug
