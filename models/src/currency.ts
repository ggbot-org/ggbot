export const currencies = ["EUR"] as const
export type Currency = (typeof currencies)[number]
