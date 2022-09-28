import { DeleteMemory, GetMemory, SetMemory } from "./nodes/memory.js";
import { Today } from "./nodes/time.js";
import {
  ExponentialMovingAverage,
  SimpleMovingAverage,
  WilderMovingAverage,
} from "./nodes/indicators/movingAverages.js";
import { RelativeStrengthIndex } from "./nodes/indicators/relativeStrengthIndex.js";

export const nodesCatalog = {
  // memory
  [DeleteMemory.kind]: DeleteMemory,
  [GetMemory.kind]: GetMemory,
  [SetMemory.kind]: SetMemory,
  // time
  [Today.kind]: Today,
  // indicators
  [ExponentialMovingAverage.kind]: ExponentialMovingAverage,
  [RelativeStrengthIndex.kind]: RelativeStrengthIndex,
  [SimpleMovingAverage.kind]: SimpleMovingAverage,
  [WilderMovingAverage.kind]: WilderMovingAverage,
};
