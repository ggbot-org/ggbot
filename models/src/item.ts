import { CreationTime } from "./time.js";

type ItemId = string;

export const isItemId = (value: unknown): value is ItemId => {
  if (typeof value !== "string") return false;
  return value !== "";
};

export type Item = {
  readonly id: ItemId;
};

export type NewItem<T extends Item> = T extends Item & CreationTime
  ? Omit<T, "id" | "whenCreated">
  : Omit<T, "id">;
