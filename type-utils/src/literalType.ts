/**
 * Helper to create a type guard for a literal type.
 *
 * @example
 *   ```ts
 *   // Define a literal type.
 *   export const myItems = ["foo", "bar"] as const;
 *   export type  MyItem = typeof myItems[number];
 *
 *   // Then create a type guard.
 *   export const isMyItem = isLiteralType<MyItem>(myItems);
 *   ```;
 */
export const isLiteralType =
  <Type>(list: readonly string[]) =>
  (arg: unknown): arg is Type =>
    typeof arg === "string" && list.includes(arg);
