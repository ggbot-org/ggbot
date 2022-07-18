export type Item = {
  readonly id: string;
};

export function isItem(value: unknown): value is Item {
  if (typeof value !== "object" || value === null) return false;
  const { id } = value as Partial<Item>;
  return typeof id === "string";
}

export type NewItem<T> = Omit<T, "id">;
