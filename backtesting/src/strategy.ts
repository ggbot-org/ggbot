import { Strategy, StrategyFlow, StrategyScheduling } from "@workspace/models"

export class BacktestingStrategy
	implements Pick<Strategy, "kind">, Pick<StrategyFlow, "view">
{
	readonly kind: Strategy["kind"]

	readonly view: StrategyFlow["view"]

	readonly schedulings: Map<StrategyScheduling["id"], StrategyScheduling>

	constructor({ kind, view }: Pick<BacktestingStrategy, "kind" | "view">) {
		this.schedulings = new Map()
		this.kind = kind
		this.view = view
	}
}
