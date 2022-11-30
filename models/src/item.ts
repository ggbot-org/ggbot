import { randomUUID } from "crypto";
import type { CreationTime } from "./time.js";

export const itemIdCharacters = "0123456789abcdefghijklmnopqrstuvwxyz";

type ItemId = string;

export const isItemId = (arg: unknown): arg is ItemId =>
  typeof arg === "string" && arg.length === nullId.length;

/** An `Item` can have a "key" that associate it to other items. */
export type ItemKey<Key> = Readonly<Key extends object ? Key : never>;

/** An `Item` is identified by its `id`. */
export type Item = ItemKey<{
  id: ItemId;
}>;

const shortId = (arg: string) => arg.substring(0, 8);

export const nullId = "00000000";

export const nullShortId = shortId(nullId);

export const newId = (): ItemId => randomUUID().substring(0, nullId.length);

export type NewItem<T extends Item> = T extends Item & CreationTime
  ? Omit<T, "id" | "whenCreated">
  : Omit<T, "id">;
