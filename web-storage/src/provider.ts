export type WebStorageProvider = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem" | "clear"
>;
