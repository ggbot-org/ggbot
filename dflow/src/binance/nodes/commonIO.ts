import { DflowNode } from "dflow";

const { input } = DflowNode;

export const pinIntervalName = "interval";
export const inputInterval = input("string", { name: pinIntervalName });

export const pinSymbolName = "symbol";
export const inputSymbol = input("string", { name: pinSymbolName });
