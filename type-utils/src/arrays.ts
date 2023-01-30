/**
 * Use `arrayTypeGuard` as a *type guard* helper to reduce boilerplate.
 *
 * @example
 * ```ts
 * export type MyItems = MyItem[];
 *
 * const isMyItems = arrayTypeGuard<MyItem>(isMyItem);
 * ```
 */
export const arrayTypeGuard =
  <T>(check: (item: unknown) => item is T) =>
  (arg: unknown): arg is T[] =>
    Array.isArray(arg) && arg.every((item) => check(item));
