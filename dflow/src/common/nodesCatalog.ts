import { DeleteMemory, GetMemory } from "./nodes/memory.js";
import { Now } from "./nodes/time.js";
import {
  ExponentialMovingAverage,
  MovingAverage,
} from "./nodes/indicators/movingAverages.js";

export const nodesCatalog = {
  // memory
  [DeleteMemory.kind]: DeleteMemory,
  [GetMemory.kind]: GetMemory,
  // time
  [Now.kind]: Now,
  // indicators
  [ExponentialMovingAverage.kind]: ExponentialMovingAverage,
  [MovingAverage.kind]: MovingAverage,
};
