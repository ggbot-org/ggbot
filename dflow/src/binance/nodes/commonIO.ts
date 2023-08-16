import { DflowNode } from "dflow"

export * from "../../common/nodes/commonIO.js"

const { input, output } = DflowNode

export const pinIntervalName = "interval"
export const inputInterval = input("string", { name: pinIntervalName })
export const outputInterval = output("string", { name: pinIntervalName })

export const pinSymbolName = "symbol"
export const inputSymbol = input("string", { name: pinSymbolName })
export const outputSymbol = output("string", { name: pinSymbolName })
