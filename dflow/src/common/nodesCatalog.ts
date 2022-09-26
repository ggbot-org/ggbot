import { DeleteMemory, GetMemory, SetMemory } from "./nodes/memory.js";
import { Today } from "./nodes/time.js";
import {
  ExponentialMovingAverage,
  SimpleMovingAverage,
} from "./nodes/indicators/movingAverages.js";

export const nodesCatalog = {
  // memory
  [DeleteMemory.kind]: DeleteMemory,
  [GetMemory.kind]: GetMemory,
  [SetMemory.kind]: SetMemory,
  // time
  [Today.kind]: Today,
  // indicators
  [ExponentialMovingAverage.kind]: ExponentialMovingAverage,
  [SimpleMovingAverage.kind]: SimpleMovingAverage,
};
