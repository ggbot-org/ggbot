import { DeleteMemory, GetMemory } from "./nodes/memory.js";
import { Now } from "./nodes/time.js";
import { Ema, Sma } from "./nodes/tulind.js";

export const nodesCatalog = {
  // memory
  [DeleteMemory.kind]: DeleteMemory,
  [GetMemory.kind]: GetMemory,
  // time
  [Now.kind]: Now,
  // tulind indicators
  [Ema.kind]: Ema,
  [Sma.kind]: Sma,
};
