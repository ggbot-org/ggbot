/**
 * Use `arrayTypeGuard` as a _type guard_ helper to reduce boilerplate.
 *
 * @example
 *   ```ts
 *   export type MyItems = MyItem[];
 *
 *   const isMyItems = arrayTypeGuard<MyItem>(isMyItem);
 *   ```;
 */
export const arrayTypeGuard =
  <T>(check: (item: unknown) => item is T) =>
  (arg: unknown): arg is T[] =>
    Array.isArray(arg) && arg.every((item) => check(item));
