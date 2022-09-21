export class ErrorInvalidName extends Error {
  constructor(value: unknown) {
    super(`Invalid name ${value}`);
  }
}

export class ErrorNameToLong extends Error {
  constructor(value: string) {
    super(`Name to long, length is ${value.length}`);
  }
}

export type NodeError = Error & {
  code?: string;
};

export const isNodeError = (arg: unknown): arg is NodeError => {
  if (!(arg instanceof Error)) return false;
  const { code } = arg as Partial<NodeError>;
  return typeof code === "string";
};
