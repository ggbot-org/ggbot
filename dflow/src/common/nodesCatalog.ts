import {
	Addition,
	Division,
	GreaterThan,
	LessThan,
	Multiplication,
	Subtraction,
} from './nodes/arithmetic.js'
import { Pop, Push, Shift } from './nodes/array.js'
import { If } from './nodes/conditional.js'
import { DefaultSymbol } from './nodes/defaults.js'
import { DeltaPercentage } from './nodes/deltaPercentage.js'
import { Bollinger, BollingerEMA } from './nodes/indicators/bollingerBands.js'
import { HeikinAshi } from './nodes/indicators/candles.js'
import { CrossOver } from './nodes/indicators/cross.js'
import {
	ExponentialMovingAverage,
	SimpleMovingAverage,
	WilderMovingAverage,
} from './nodes/indicators/movingAverages.js'
import { RelativeStrengthIndex } from './nodes/indicators/relativeStrengthIndex.js'
import { TypicalPrice } from './nodes/indicators/typicalPrice.js'
import {
	And,
	Equal,
	Not,
	NotEqual,
	NullishCoaleshing,
	Or,
} from './nodes/logic.js'
import { Max, Min } from './nodes/mathFunctions.js'
import { MediatorLong, MediatorShort } from './nodes/mediator.js'
import { DeleteMemory, GetMemory, SetMemory } from './nodes/memory.js'
import {
	BooleanParameter,
	NumberParameter,
	PercentageParameter,
	StringParameter,
} from './nodes/parameters.js'
import { Time, TimeMinus, TimePlus, TimeToDay, Today } from './nodes/time.js'
import { TrailingStopDown, TrailingStopUp } from './nodes/trailingStop.js'

export const nodesCatalog = {
	// arithmetic
	[Addition.kind]: Addition,
	[Subtraction.kind]: Subtraction,
	[Multiplication.kind]: Multiplication,
	[Division.kind]: Division,
	[GreaterThan.kind]: GreaterThan,
	[LessThan.kind]: LessThan,
	// array
	[Shift.kind]: Shift,
	[Pop.kind]: Pop,
	[Push.kind]: Push,
	// conditional
	[If.kind]: If,
	// deltaPercentage
	[DeltaPercentage.kind]: DeltaPercentage,
	// cross
	[CrossOver.kind]: CrossOver,
	// defaults
	[DefaultSymbol.kind]: DefaultSymbol,
	// logic
	[And.kind]: And,
	[Equal.kind]: Equal,
	[Not.kind]: Not,
	[NotEqual.kind]: NotEqual,
	[NullishCoaleshing.kind]: NullishCoaleshing,
	[Or.kind]: Or,
	// indicators
	[Bollinger.kind]: Bollinger,
	[BollingerEMA.kind]: BollingerEMA,
	[ExponentialMovingAverage.kind]: ExponentialMovingAverage,
	[HeikinAshi.kind]: HeikinAshi,
	[MediatorLong.kind]: MediatorLong,
	[MediatorShort.kind]: MediatorShort,
	[RelativeStrengthIndex.kind]: RelativeStrengthIndex,
	[SimpleMovingAverage.kind]: SimpleMovingAverage,
	[TrailingStopDown.kind]: TrailingStopDown,
	[TrailingStopUp.kind]: TrailingStopUp,
	[TypicalPrice.kind]: TypicalPrice,
	[WilderMovingAverage.kind]: WilderMovingAverage,
	// mathFunctions
	[Max.kind]: Max,
	[Min.kind]: Min,
	// memory
	[DeleteMemory.kind]: DeleteMemory,
	[GetMemory.kind]: GetMemory,
	[SetMemory.kind]: SetMemory,
	// parameters
	[BooleanParameter.kind]: BooleanParameter,
	[NumberParameter.kind]: NumberParameter,
	[PercentageParameter.kind]: PercentageParameter,
	[StringParameter.kind]: StringParameter,
	// time
	[Time.kind]: Time,
	[TimeMinus.kind]: TimeMinus,
	[TimePlus.kind]: TimePlus,
	[TimeToDay.kind]: TimeToDay,
	[Today.kind]: Today,
}
