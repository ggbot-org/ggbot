import { JsonValue } from "type-fest";

export type OperationInput = JsonValue | void;

export type OperationOutput = JsonValue | undefined;

export type Operation<
  Input extends OperationInput,
  Output extends OperationOutput
> = {
  in: Input;
  out: Output;
  func: (_: Input) => Promise<Output>;
};
