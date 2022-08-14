import { GetMemory } from "./memory.js";
import { Ema, Sma } from "./tulind.js";

export const catalog = {
  // memory
  [GetMemory.kind]: GetMemory,
  // tulind indicators
  [Ema.kind]: Ema,
  [Sma.kind]: Sma,
};
