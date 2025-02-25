import { Dflow, DflowNode } from 'dflow'
import {
	getTime,
	isTime,
	isTimeUnit,
	timeToDay,
	timeToTimestamp,
	TimeUnit,
} from 'minimal-time-helpers'

import { DflowCommonContext as Context } from '../context.js'

const { input, output } = Dflow

const outputDay = output('string', { name: 'yyyy-mm-dd' })

const inputTime = input('number', { name: 'time' })
const outputTime = output('number', { name: 'time' })

const inputTimeUnit = input('string', { name: 'timeUnit' })

const timeOutputs = [outputTime, output('string', { name: 'timestamp' })]

export const coerceToTimeUnit = (arg: string): TimeUnit | undefined => {
	if (isTimeUnit(arg)) return arg
	if (['1s', 'seconds'].includes(arg)) return 'second'
	if (['1m', 'minutes'].includes(arg)) return 'minute'
	if (['1h', 'hours'].includes(arg)) return 'hour'
	if (['1d', 'days'].includes(arg)) return 'day'
	return
}

const timeTranslatorInputs = [
	inputTime,
	inputTimeUnit,
	input('number', { name: 'num' }),
]

const translateTime = (
	time: number,
	timeUnitStr: string,
	num: number
): number | undefined => {
	if (!isTime(time)) return
	const timeUnit = coerceToTimeUnit(timeUnitStr)
	if (timeUnit === 'second') return getTime(time).plus(num).seconds
	if (timeUnit === 'minute') return getTime(time).plus(num).minutes
	if (timeUnit === 'hour') return getTime(time).plus(num).hours
	if (timeUnit === 'day') return getTime(time).plus(num).days
}

export class Time extends DflowNode {
	static kind = 'time'
	static outputs = timeOutputs
	run() {
		const { time } = this.host.context as Context
		const timestamp = timeToTimestamp(time)
		this.output(0).data = time
		this.output(1).data = timestamp
	}
}

export class TimeMinus extends DflowNode {
	static kind = 'timeMinus'
	static inputs = timeTranslatorInputs
	static outputs = timeOutputs
	run() {
		const time = this.input(0).data as number
		const timeUnit = this.input(1).data as string
		const num = this.input(2).data as number
		const result = translateTime(time, timeUnit, num * -1)
		if (result) this.output(0).data = result
		else this.clearOutputs()
	}
}

export class TimePlus extends DflowNode {
	static kind = 'timePlus'
	static inputs = timeTranslatorInputs
	static outputs = timeOutputs
	run() {
		const time = this.input(0).data as number
		const timeUnit = this.input(1).data as string
		const num = this.input(2).data as number
		const result = translateTime(time, timeUnit, num)
		if (result) this.output(0).data = result
		else this.clearOutputs()
	}
}

export class TimeToDay extends DflowNode {
	static kind = 'timeToDay'
	static inputs = [inputTime]
	static outputs = [outputDay]
	run() {
		const time = this.input(0).data as number
		if (isTime(time)) this.output(0).data = timeToDay(time)
		else this.clearOutputs()
	}
}

export class Today extends DflowNode {
	static kind = 'today'
	static outputs = [outputDay]
	run() {
		const { time } = this.host.context as Context
		const day = timeToDay(time)
		this.output(0).data = day
	}
}
