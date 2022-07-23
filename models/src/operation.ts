import { JsonValue } from "type-fest";

type OperationInput = JsonValue | void;

type OperationOutput = JsonValue | undefined;

export type Operation<
  Input extends OperationInput,
  Output extends OperationOutput
> = {
  in: Input;
  out: Output;
  func: (_: Input) => Promise<Output>;
};
