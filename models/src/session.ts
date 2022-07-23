import { Item, isItemId } from "./item.js";
import { CreationDay, isCreationDay } from "./time.js";

export type Session = Item & CreationDay;

export function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const { id, creationDay } = value as Partial<Session>;
  return isItemId(id) && isCreationDay({ creationDay });
}
