import { DeleteMemory, GetMemory } from "./nodes/memory.js";
import { Ema, Sma } from "./nodes/tulind.js";

export const nodesCatalog = {
  // memory
  [DeleteMemory.kind]: DeleteMemory,
  [GetMemory.kind]: GetMemory,
  // tulind indicators
  [Ema.kind]: Ema,
  [Sma.kind]: Sma,
};
