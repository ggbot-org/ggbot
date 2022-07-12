export type Item = {
  readonly id: string;
};

export type NewItem<T> = Omit<T, "id">;
