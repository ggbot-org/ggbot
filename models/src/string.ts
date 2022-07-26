/**
 * A Name is any not empty string
 */
export type Name = string;

export const isName = (value: unknown): value is Name =>
  typeof value === "string" && value !== "";
