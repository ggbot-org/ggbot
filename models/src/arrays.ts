export const arrayTypeGuard =
  <T>(check: (item: unknown) => item is T) =>
  (arg: unknown): arg is T[] =>
    Array.isArray(arg) && arg.every((item) => check(item));
