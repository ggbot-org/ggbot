import {
	dateToDay,
	dateToTime,
	dateToTimestamp,
	dayToDate,
	timestampToDate,
	timeToDate
} from "./conversions.js"
import { isInvalidDate } from "./date.js"
import { Day } from "./day.js"
import { ErrorInvalidDate } from "./errors.js"
import { Time } from "./time.js"
import { Timestamp } from "./timestamp.js"
import { TimeUnit } from "./units.js"

type TimeTruncator<Input, Output> = (arg: Input) => {
	to: Record<Extract<TimeUnit, "second" | "minute" | "hour" | "day">, Output>
}

type TimeTranslationUnits<TimeType> = Record<TimeUnit, TimeType>

type TimeTranslationPluralUnits<TimeType> = {
	years: TimeType
	months: TimeType
	days: TimeType
	hours: TimeType
	minutes: TimeType
	seconds: TimeType
}

type TimeTranslator<TimeType> = (arg: TimeType) => {
	plus: (num: number) => TimeTranslationPluralUnits<TimeType>
	plusOne: TimeTranslationUnits<TimeType>
	minus: (num: number) => TimeTranslationPluralUnits<TimeType>
	minusOne: TimeTranslationUnits<TimeType>
}

/** Translate `Date`. */
export const getDate: TimeTranslator<Date> = (input) => {
	if (isInvalidDate(input)) throw new ErrorInvalidDate()
	const date = new Date(input)
	return {
		plus: (num) => ({
			get years() {
				date.setFullYear(date.getFullYear() + num)
				return date
			},
			get months() {
				date.setMonth(date.getMonth() + num)
				return date
			},
			get days() {
				date.setDate(date.getDate() + num)
				return date
			},
			get hours() {
				date.setHours(date.getHours() + num)
				return date
			},
			get minutes() {
				date.setMinutes(date.getMinutes() + num)
				return date
			},
			get seconds() {
				date.setSeconds(date.getSeconds() + num)
				return date
			}
		}),
		get plusOne() {
			return {
				get year() {
					return getDate(date).plus(1).years
				},
				get month() {
					return getDate(date).plus(1).months
				},
				get day() {
					return getDate(date).plus(1).days
				},
				get hour() {
					return getDate(date).plus(1).hours
				},
				get minute() {
					return getDate(date).plus(1).minutes
				},
				get second() {
					return getDate(date).plus(1).seconds
				}
			}
		},
		minus: (num) => ({
			get years() {
				return getDate(date).plus(-1 * num).years
			},
			get months() {
				return getDate(date).plus(-1 * num).months
			},
			get days() {
				return getDate(date).plus(-1 * num).days
			},
			get hours() {
				return getDate(date).plus(-1 * num).hours
			},
			get minutes() {
				return getDate(date).plus(-1 * num).minutes
			},
			get seconds() {
				return getDate(date).plus(-1 * num).seconds
			}
		}),
		get minusOne() {
			return {
				get year() {
					return getDate(date).minus(1).years
				},
				get month() {
					return getDate(date).minus(1).months
				},
				get day() {
					return getDate(date).minus(1).days
				},
				get hour() {
					return getDate(date).minus(1).hours
				},
				get minute() {
					return getDate(date).minus(1).minutes
				},
				get second() {
					return getDate(date).minus(1).seconds
				}
			}
		}
	}
}

/** Translate `Day`. */
export const getDay: TimeTranslator<Day> = (day) => {
	const date = dayToDate(day)
	return {
		plus: (num) => ({
			get years() {
				return dateToDay(getDate(date).plus(num).years)
			},
			get months() {
				return dateToDay(getDate(date).plus(num).months)
			},
			get days() {
				return dateToDay(getDate(date).plus(num).days)
			},
			get hours() {
				return dateToDay(getDate(date).plus(num).hours)
			},
			get minutes() {
				return dateToDay(getDate(date).plus(num).minutes)
			},
			get seconds() {
				return dateToDay(getDate(date).plus(num).seconds)
			}
		}),
		get plusOne() {
			return {
				get year() {
					return dateToDay(getDate(date).plusOne.year)
				},
				get month() {
					return dateToDay(getDate(date).plusOne.month)
				},
				get day() {
					return dateToDay(getDate(date).plusOne.day)
				},
				get hour() {
					return dateToDay(getDate(date).plusOne.hour)
				},
				get minute() {
					return dateToDay(getDate(date).plusOne.minute)
				},
				get second() {
					return dateToDay(getDate(date).plusOne.second)
				}
			}
		},
		minus: (num) => ({
			get years() {
				return dateToDay(getDate(date).minus(num).years)
			},
			get months() {
				return dateToDay(getDate(date).minus(num).months)
			},
			get days() {
				return dateToDay(getDate(date).minus(num).days)
			},
			get hours() {
				return dateToDay(getDate(date).minus(num).hours)
			},
			get minutes() {
				return dateToDay(getDate(date).minus(num).minutes)
			},
			get seconds() {
				return dateToDay(getDate(date).minus(num).seconds)
			}
		}),
		get minusOne() {
			return {
				get year() {
					return dateToDay(getDate(date).minusOne.year)
				},
				get month() {
					return dateToDay(getDate(date).minusOne.month)
				},
				get day() {
					return dateToDay(getDate(date).minusOne.day)
				},
				get hour() {
					return dateToDay(getDate(date).minusOne.hour)
				},
				get minute() {
					return dateToDay(getDate(date).minusOne.minute)
				},
				get second() {
					return dateToDay(getDate(date).minusOne.second)
				}
			}
		}
	}
}

/** Translate `Time`. */
export const getTime: TimeTranslator<Time> = (time) => {
	const date = timeToDate(time)
	return {
		plus: (num) => ({
			get years() {
				return dateToTime(getDate(date).plus(num).years)
			},
			get months() {
				return dateToTime(getDate(date).plus(num).months)
			},
			get days() {
				return dateToTime(getDate(date).plus(num).days)
			},
			get hours() {
				return dateToTime(getDate(date).plus(num).hours)
			},
			get minutes() {
				return dateToTime(getDate(date).plus(num).minutes)
			},
			get seconds() {
				return dateToTime(getDate(date).plus(num).seconds)
			}
		}),
		get plusOne() {
			return {
				get year() {
					return dateToTime(getDate(date).plusOne.year)
				},
				get month() {
					return dateToTime(getDate(date).plusOne.month)
				},
				get day() {
					return dateToTime(getDate(date).plusOne.day)
				},
				get hour() {
					return dateToTime(getDate(date).plusOne.hour)
				},
				get minute() {
					return dateToTime(getDate(date).plusOne.minute)
				},
				get second() {
					return dateToTime(getDate(date).plusOne.second)
				}
			}
		},
		minus: (num) => ({
			get years() {
				return dateToTime(getDate(date).minus(num).years)
			},
			get months() {
				return dateToTime(getDate(date).minus(num).months)
			},
			get days() {
				return dateToTime(getDate(date).minus(num).days)
			},
			get hours() {
				return dateToTime(getDate(date).minus(num).hours)
			},
			get minutes() {
				return dateToTime(getDate(date).minus(num).minutes)
			},
			get seconds() {
				return dateToTime(getDate(date).minus(num).seconds)
			}
		}),
		get minusOne() {
			return {
				get year() {
					return dateToTime(getDate(date).minusOne.year)
				},
				get month() {
					return dateToTime(getDate(date).minusOne.month)
				},
				get day() {
					return dateToTime(getDate(date).minusOne.day)
				},
				get hour() {
					return dateToTime(getDate(date).minusOne.hour)
				},
				get minute() {
					return dateToTime(getDate(date).minusOne.minute)
				},
				get second() {
					return dateToTime(getDate(date).minusOne.second)
				}
			}
		}
	}
}

/** Truncate `Date`. */
export const truncateDate: TimeTruncator<Date, Date> = (date) => {
	if (isInvalidDate(date)) throw new ErrorInvalidDate()
	return {
		to: {
			get second() {
				date.setMilliseconds(0)
				return date
			},
			get minute() {
				date.setMilliseconds(0)
				date.setUTCSeconds(0)
				return date
			},
			get hour() {
				date.setMilliseconds(0)
				date.setUTCSeconds(0)
				date.setUTCMinutes(0)
				return date
			},
			get day() {
				date.setMilliseconds(0)
				date.setUTCSeconds(0)
				date.setUTCMinutes(0)
				date.setUTCHours(0)
				return date
			}
		}
	}
}

/** Truncate `Time`. */
export const truncateTime: TimeTruncator<Time, Time> = (time) => {
	const date = timeToDate(time)
	return {
		to: {
			get second() {
				return dateToTime(truncateDate(date).to.second)
			},
			get minute() {
				return dateToTime(truncateDate(date).to.minute)
			},
			get hour() {
				return dateToTime(truncateDate(date).to.hour)
			},
			get day() {
				return dateToTime(truncateDate(date).to.day)
			}
		}
	}
}

/** Truncate `Timestamp`. */
export const truncateTimestamp: TimeTruncator<Timestamp, Timestamp> = (
	timestamp
) => {
	const date = timestampToDate(timestamp)
	return {
		to: {
			get second() {
				return dateToTimestamp(truncateDate(date).to.second)
			},
			get minute() {
				return dateToTimestamp(truncateDate(date).to.minute)
			},
			get hour() {
				return dateToTimestamp(truncateDate(date).to.hour)
			},
			get day() {
				return dateToTimestamp(truncateDate(date).to.day)
			}
		}
	}
}
