import {
  Addition,
  Subtraction,
  Multiplication,
  Division,
  GreaterThan,
  LessThan,
} from "./nodes/arithmetic.js";
import { Shift, Pop, Push } from "./nodes/array.js";
import { If } from "./nodes/conditional.js";
import { BollingerBands } from "./nodes/indicators/bollingerBands.js";
import { CrossOver } from "./nodes/indicators/cross.js";
import { HeikinAshi } from "./nodes/indicators/candles.js";
import {
  ExponentialMovingAverage,
  SimpleMovingAverage,
  WilderMovingAverage,
} from "./nodes/indicators/movingAverages.js";
import { RelativeStrengthIndex } from "./nodes/indicators/relativeStrengthIndex.js";
import { TypicalPrice } from "./nodes/indicators/typicalPrice.js";
import { InputBoolean, InputNumber, InputString } from "./nodes/inputs.js";
import { And, Equal, Not, NullishCoaleshing, Or } from "./nodes/logic.js";
import { Max, Min } from "./nodes/mathFunctions.js";
import { DeleteMemory, GetMemory, SetMemory } from "./nodes/memory.js";
import { Time, TimeToDay, TimeMinus, TimePlus, Today } from "./nodes/time.js";

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
  // cross
  [CrossOver.kind]: CrossOver,
  // logic
  [And.kind]: And,
  [Equal.kind]: Equal,
  [Not.kind]: Not,
  [NullishCoaleshing.kind]: NullishCoaleshing,
  [Or.kind]: Or,
  // indicators
  [BollingerBands.kind]: BollingerBands,
  [ExponentialMovingAverage.kind]: ExponentialMovingAverage,
  [HeikinAshi.kind]: HeikinAshi,
  [RelativeStrengthIndex.kind]: RelativeStrengthIndex,
  [SimpleMovingAverage.kind]: SimpleMovingAverage,
  [TypicalPrice.kind]: TypicalPrice,
  [WilderMovingAverage.kind]: WilderMovingAverage,
  // inputs
  [InputBoolean.kind]: InputBoolean,
  [InputNumber.kind]: InputNumber,
  [InputString.kind]: InputString,
  // mathFunctions
  [Max.kind]: Max,
  [Min.kind]: Min,
  // memory
  [DeleteMemory.kind]: DeleteMemory,
  [GetMemory.kind]: GetMemory,
  [SetMemory.kind]: SetMemory,
  // time
  [Time.kind]: Time,
  [TimeMinus.kind]: TimeMinus,
  [TimePlus.kind]: TimePlus,
  [TimeToDay.kind]: TimeToDay,
  [Today.kind]: Today,
};
