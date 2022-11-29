export const isObject = (arg: unknown): arg is object =>
  typeof arg === "object" && arg !== null;
