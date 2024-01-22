import { Day } from "minimal-time-helpers"

import { BalanceChangeEvent } from "./balanceChangeEvent.js"

export type StrategyBalance = { day: Day; data: BalanceChangeEvent[] }
