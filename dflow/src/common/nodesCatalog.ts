import {
  Addition,
  Subtraction,
  Multiplication,
  Division,
  GreaterThan,
  LessThan,
} from "./nodes/arithmetic.js";
import { Shift, Pop, Push } from "./nodes/array.js";
import { CandlesChart } from "./nodes/charts.js";
import { BollingerBands } from "./nodes/indicators/bollingerBands.js";
import { HeikinAshi } from "./nodes/indicators/candles.js";
import {
  ExponentialMovingAverage,
  SimpleMovingAverage,
  WilderMovingAverage,
} from "./nodes/indicators/movingAverages.js";
import { RelativeStrengthIndex } from "./nodes/indicators/relativeStrengthIndex.js";
import { TypicalPrice } from "./nodes/indicators/typicalPrice.js";
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
  // charts
  [CandlesChart.kind]: CandlesChart,
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
  // indicators
  [BollingerBands.kind]: BollingerBands,
  [ExponentialMovingAverage.kind]: ExponentialMovingAverage,
  [HeikinAshi.kind]: HeikinAshi,
  [RelativeStrengthIndex.kind]: RelativeStrengthIndex,
  [SimpleMovingAverage.kind]: SimpleMovingAverage,
  [TypicalPrice.kind]: TypicalPrice,
  [WilderMovingAverage.kind]: WilderMovingAverage,
};
