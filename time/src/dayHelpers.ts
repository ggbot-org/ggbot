import { dateToDay } from "./conversions.js"
import { Day } from "./day.js"
import { getDay } from "./operators.js"

export const today = (): Day => dateToDay(new Date())

export const yesterday = (): Day => getDay(today()).minus(1).days()
