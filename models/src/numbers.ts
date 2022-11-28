export type NaturalNumber = number;

export const isNaturalNumber = (arg: unknown): arg is NaturalNumber =>
  typeof arg === "number" && Number.isInteger(arg) && arg > 0;
