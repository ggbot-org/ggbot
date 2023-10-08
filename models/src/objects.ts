declare const emptyObjectSymbol: unique symbol

/**
 * Represents a strictly empty plain object, the `{}` value.
 *
 * Code from
 * {@link https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts}
 */
export type EmptyObject = { [emptyObjectSymbol]?: never }
