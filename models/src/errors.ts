export class ErrorInvalidName extends TypeError {
  constructor(arg: unknown) {
    super(`Invalid name ${arg}`);
  }
}

export class ErrorInvalidEmailAddress extends TypeError {
  constructor(arg: unknown) {
    super(`Invalid email ${arg}`);
  }
}

export class ErrorNameToLong extends TypeError {
  constructor(arg: string) {
    super(`Name to long, length is ${arg.length}`);
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
