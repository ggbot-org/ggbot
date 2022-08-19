/**
 * Helper to create a type guard for a literal type
 *
 * @example
 * ```typescript
 * // Define a literal type
 * export const myStatues = ["foo", "bar"] as const;
 * export type  MyStatus = typeof myList[number];
 *
 * // Then create a type guard
 * export const isMyStatus = isLiteralType<MyStatus>(myStatues);
 * ```
 */
export const isLiteralType =
  <Type>(list: readonly string[]) =>
  (value: unknown): value is Type => {
    if (typeof value !== "string") return false;
    return list.includes(value);
  };
