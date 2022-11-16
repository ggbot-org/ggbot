import { ErrorInvalidArg } from "./errors.js";

/** A Name is any not empty string, with a max length. */
export type Name = string;

export const minNameLength = 1;
export const maxNameLength = 128;

export const isName = (arg: unknown): arg is Name => {
  if (typeof arg !== "string") return false;
  const name = normalizeName(arg);
  const len = name.length;
  return len > minNameLength && len < maxNameLength;
};

export const throwIfInvalidName = (arg: unknown): void => {
  if (!isName(arg)) throw new ErrorInvalidArg({ arg, type: "Name" });
};

export const normalizeName = (name: string) => name.trim();
