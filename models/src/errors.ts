export class ErrorInvalidArg extends Error {
  static message(type: ErrorInvalidArg["type"]) {
    return `Invalid ${type}`;
  }
  readonly arg: unknown;
  readonly type: "EmailAddress" | "Name";
  constructor({ arg, type }: Pick<ErrorInvalidArg, "arg" | "type">) {
    super(ErrorInvalidArg.message(type));
    this.arg = arg;
    this.type = type;
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
