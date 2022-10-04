import { DflowNode } from "dflow";

const { input, output } = DflowNode;

export const inputClose = input("array", { name: "close" });
export const outputClose = input("array", { name: "close" });

export const inputHigh = input("array", { name: "high" });
export const outputHigh = output("array", { name: "high" });

export const inputLow = input("array", { name: "low" });
export const outputLow = output("array", { name: "low" });

export const outputLastValue = output("number", { name: "last" });

export const outputOpen = output("array", { name: "open" });

export const inputPeriod = input("number", { name: "period" });

export const inputValues = input("array", { name: "values" });
export const outputValues = output("array", { name: "values" });

export const outputValue = output([], { name: "value" });

export const outputVolume = input("number", { name: "volume" });
