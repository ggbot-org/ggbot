/**
 * Use `isMaybeObject` as a _type guard_ helper.
 *
 * @example
 *
 * ```ts
 * type Foo = { bar: boolean };
 *
 * const isFoo = (arg: unknown): arg is Foo => {
 *   if (isMaybeObject<Foo>(arg)) return false;
 *   const { bar } = arg;
 *   return typeof bar === "boolean";
 * };
 * ```
 */
export const isMaybeObject = <T extends object>(
  arg: unknown
): arg is {
  [K in keyof T]: unknown;
} => typeof arg === "object" && arg !== null && !Array.isArray(arg);

export const objectTypeGuard =
  <T extends object>(check: (obj: { [K in keyof T]: unknown }) => boolean) =>
  (arg: unknown): arg is T =>
    isMaybeObject<T>(arg) && check(arg);
