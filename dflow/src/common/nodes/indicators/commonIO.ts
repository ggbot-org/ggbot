import { DflowNode } from "dflow";

const { input, output } = DflowNode;

export const inputValues = input("array", { name: "values" });

export const inputPeriod = input("number", { name: "period" });

export const outputValues = output("array", { name: "values" });

export const outputLastValue = output("number", { name: "last" });
