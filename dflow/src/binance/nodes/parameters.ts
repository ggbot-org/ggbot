import {
	isStrategyParameterKey,
	isStrategyParameterString
} from "@workspace/models"
import { DflowNode } from "dflow"

import { inputKey } from "../../common/nodes/commonIO.js"
import { DflowBinanceContext as Context } from "../context.js"
import { isDflowBinanceKlineInterval } from "../klineIntervals.js"
import {
	inputInterval,
	inputSymbol,
	outputInterval,
	outputSymbol
} from "./commonIO.js"

export class SymbolParameter extends DflowNode {
	static kind = "symbolParameter"
	static inputs = [inputKey, inputSymbol]
	static outputs = [outputSymbol]
	async run() {
		const { binance, params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (
			!isStrategyParameterKey(key) ||
			!isStrategyParameterString(defaultValue)
		)
			return this.clearOutputs()
		let value = defaultValue
		if (key in params) {
			const inputValue = params[key]
			if (isStrategyParameterString(inputValue)) value = inputValue
		}
		const isBinanceSymbol = await binance.isBinanceSymbol(value)
		if (!isBinanceSymbol) return this.clearOutputs()
		this.output(0).data = value
	}
}

export class IntervalParameter extends DflowNode {
	static kind = "intervalParameter"
	static inputs = [inputKey, inputInterval]
	static outputs = [outputInterval]
	run() {
		const { params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (
			!isStrategyParameterKey(key) ||
			!isStrategyParameterString(defaultValue)
		)
			return this.clearOutputs()
		let value = defaultValue
		if (key in params) {
			const inputValue = params[key]
			if (isStrategyParameterString(inputValue)) value = inputValue
		}
		if (!isDflowBinanceKlineInterval(value)) return this.clearOutputs()
		this.output(0).data = value
	}
}
