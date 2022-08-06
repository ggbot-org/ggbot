import { ErrorInvalidName, ErrorNameToLong } from "./errors.js";

/**
 * A Name is any not empty string, no longer than 256 chars
 */
export type Name = string;

export const minNameLength = 1;
export const maxNameLength = 256;

export const isName = (value: unknown): value is Name => {
  if (typeof value !== "string") return false;
  const name = normalizeName(value);
  if (name.length < minNameLength) return false;
  if (name.length > maxNameLength) return false;
  return true;
};

export const throwIfInvalidName = (value: unknown): void => {
  if (typeof value !== "string") throw new ErrorInvalidName(value);
  const name = normalizeName(value);
  if (name.length < minNameLength) throw new ErrorInvalidName(name);
  if (name.length > maxNameLength) throw new ErrorNameToLong(name);
};

export const normalizeName = (name: string) => name.trim();
