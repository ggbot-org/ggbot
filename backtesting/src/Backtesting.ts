import { DayInterval } from "minimal-time-helpers"

export class Backtesting {
	dayInterval: DayInterval

	constructor({ dayInterval }: Pick<Backtesting, "dayInterval">) {
		this.dayInterval = dayInterval
	}
}
