import { JsonArray, JsonObject } from "type-fest";

type OperationInput = JsonObject | void;

type OperationOutput = JsonArray | JsonObject | undefined;

export type Operation<
  Input extends OperationInput,
  Output extends OperationOutput
> = {
  input: Input;
  output: Output;
  resolver: (_: Input) => Promise<Output>;
};
