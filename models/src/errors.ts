export class ErrorInvalidName extends TypeError {
  constructor() {
    super("Invalid name");
    this.name = ErrorInvalidName.name;
  }
}

export class ErrorInvalidEmailAddress extends TypeError {
  constructor(arg: unknown) {
    super(`Invalid email ${arg}`);
    this.name = ErrorInvalidEmailAddress.name;
  }
}

export class ErrorNameTooLong extends TypeError {
  nameLenght: number;
  constructor(arg: string) {
    super("Name too long");
    this.name = ErrorNameTooLong.name;
    this.nameLenght = arg.length;
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
