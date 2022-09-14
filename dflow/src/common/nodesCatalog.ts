import { Addition } from "./nodes/arithmetic.js";
import { DeleteMemory, GetMemory, SetMemory } from "./nodes/memory.js";
import { Today } from "./nodes/time.js";
import {
  ExponentialMovingAverage,
  MovingAverage,
} from "./nodes/indicators/movingAverages.js";

export const nodesCatalog = {
  // arithmetic
  [Addition.kind]: Addition,
  // memory
  [DeleteMemory.kind]: DeleteMemory,
  [GetMemory.kind]: GetMemory,
  [SetMemory.kind]: SetMemory,
  // time
  [Today.kind]: Today,
  // indicators
  [ExponentialMovingAverage.kind]: ExponentialMovingAverage,
  [MovingAverage.kind]: MovingAverage,
};
