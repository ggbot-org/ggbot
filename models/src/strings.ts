export type FiniteString = string;

const stringMaxLength = 256;

export const isFiniteString = (arg: unknown): arg is FiniteString => {
  if (typeof arg !== "string") return false;
  return arg.length <= stringMaxLength;
};

export type NonEmptyString<T = string> = T extends "" ? never : T;

export const isNonEmptyString = (arg: unknown): arg is NonEmptyString =>
  isFiniteString(arg) && arg !== "";
