/* eslint-disable sort-keys */
import { NaturalNumber } from "@ggbot2/type-utils"
import { getTime, Time } from "minimal-time-helpers"

import { BinanceKlineInterval } from "./types.js"

export const getBinanceIntervalTime: Record<
	BinanceKlineInterval,
	(time: Time) => {
		plus: (num: NaturalNumber) => Time
		minus: (num: NaturalNumber) => Time
	}
> = {
	"1s": (time) => ({
		plus: (num) => getTime(time).plus(num).seconds,
		minus: (num) => getTime(time).minus(num).seconds
	}),
	"1m": (time) => ({
		plus: (num) => getTime(time).plus(num).minutes,
		minus: (num) => getTime(time).minus(num).minutes
	}),
	"3m": (time) => ({
		plus: (num) => getTime(time).plus(3 * num).minutes,
		minus: (num) => getTime(time).minus(3 * num).minutes
	}),
	"5m": (time) => ({
		plus: (num) => getTime(time).plus(5 * num).minutes,
		minus: (num) => getTime(time).minus(5 * num).minutes
	}),
	"15m": (time) => ({
		plus: (num) => getTime(time).plus(15 * num).minutes,
		minus: (num) => getTime(time).minus(15 * num).minutes
	}),
	"30m": (time) => ({
		plus: (num) => getTime(time).plus(30 * num).minutes,
		minus: (num) => getTime(time).minus(30 * num).minutes
	}),
	"1h": (time) => ({
		plus: (num) => getTime(time).plus(num).hours,
		minus: (num) => getTime(time).minus(num).hours
	}),
	"2h": (time) => ({
		plus: (num) => getTime(time).plus(2 * num).hours,
		minus: (num) => getTime(time).minus(2 * num).hours
	}),
	"4h": (time) => ({
		plus: (num) => getTime(time).plus(4 * num).hours,
		minus: (num) => getTime(time).minus(4 * num).hours
	}),
	"6h": (time) => ({
		plus: (num) => getTime(time).plus(6 * num).hours,
		minus: (num) => getTime(time).minus(6 * num).hours
	}),
	"8h": (time) => ({
		plus: (num) => getTime(time).plus(8 * num).hours,
		minus: (num) => getTime(time).minus(8 * num).hours
	}),
	"12h": (time) => ({
		plus: (num) => getTime(time).plus(12 * num).hours,
		minus: (num) => getTime(time).minus(12 * num).hours
	}),
	"1d": (time) => ({
		plus: (num) => getTime(time).plus(num).days,
		minus: (num) => getTime(time).minus(num).days
	}),
	"3d": (time) => ({
		plus: (num) => getTime(time).plus(3 * num).days,
		minus: (num) => getTime(time).minus(3 * num).days
	}),
	"1w": (time) => ({
		plus: (num) => getTime(time).plus(7 * num).days,
		minus: (num) => getTime(time).minus(7 * num).days
	}),
	"1M": (time) => ({
		plus: (num) => getTime(time).plus(num).months,
		minus: (num) => getTime(time).minus(num).months
	})
}
