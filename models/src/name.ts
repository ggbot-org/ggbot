import { ErrorInvalidName, ErrorNameToLong } from "./errors.js";

/**
 * A Name is any not empty string, with a max length
 */
export type Name = string;

export const minNameLength = 1;
export const maxNameLength = 128;

export const isName = (value: unknown): value is Name => {
  if (typeof value !== "string") return false;
  const name = normalizeName(value);
  if (name.length < minNameLength) return false;
  if (name.length > maxNameLength) return false;
  return true;
};

/**
 * @throws {ErrorInvalidName}
 * @throws {ErrorNameToLong}
 */
export const throwIfInvalidName = (value: unknown): void => {
  if (typeof value !== "string") throw new ErrorInvalidName(value);
  const name = normalizeName(value);
  if (name.length < minNameLength) throw new ErrorInvalidName(name);
  if (name.length > maxNameLength) throw new ErrorNameToLong(name);
};

export const normalizeName = (name: string) => name.trim();
