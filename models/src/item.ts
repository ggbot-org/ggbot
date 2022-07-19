type ItemId = string;

export function isItemId(value: unknown): value is ItemId {
  if (typeof value !== "string") return false;
  return value !== "";
}

export type Item = {
  readonly id: ItemId;
};

export function isItem(value: unknown): value is Item {
  if (typeof value !== "object" || value === null) return false;
  const { id } = value as Partial<Item>;
  return isItemId(id);
}

export type NewItem<T> = Omit<T, "id">;
