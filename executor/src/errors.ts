import { Strategy } from "@workspace/models"

export class ErrorExecutionStrategy extends Error {
	static errorName = "ErrorExecutionStrategy"
	readonly strategyKind: Strategy["kind"]
	readonly strategyId: Strategy["id"]
	constructor({
		strategyKind,
		strategyId
	}: Pick<ErrorExecutionStrategy, "strategyKind" | "strategyId">) {
		super(ErrorExecutionStrategy.message(strategyKind, strategyId))
		this.strategyKind = strategyKind
		this.strategyId = strategyId
	}
	static message(
		strategyKind: ErrorExecutionStrategy["strategyKind"],
		strategyId: ErrorExecutionStrategy["strategyId"]
	) {
		return `Failed strategy execution strategyKind=${strategyKind} strategyId=${strategyId}`
	}
	toValue() {
		return {
			name: ErrorExecutionStrategy.errorName,
			info: {
				strategyKind: this.strategyKind,
				strategyId: this.strategyId
			}
		}
	}
}

type NodeError = Error & {
	code?: string
}

export const isNodeError = (arg: unknown): arg is NodeError => {
	if (!(arg instanceof Error)) return false
	const { code } = arg as Partial<NodeError>
	return typeof code === "string"
}
