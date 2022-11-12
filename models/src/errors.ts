export class ErrorInvalidName extends TypeError {
  constructor(arg: unknown) {
    super(`Invalid name ${arg}`);
    this.name = ErrorInvalidName.name;
  }
}

export class ErrorInvalidEmailAddress extends TypeError {
  constructor(arg: unknown) {
    super(`Invalid email ${arg}`);
    this.name = ErrorInvalidEmailAddress.name;
  }
}

export class ErrorNameToLong extends TypeError {
  constructor(arg: string) {
    super(`Name to long, length is ${arg.length}`);
    this.name = ErrorNameToLong.name;
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
