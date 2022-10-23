import { DflowValue } from "dflow";

export type OperationInput = DflowValue | void;

export type OperationOutput = DflowValue | null;

export type Operation<
  Input extends OperationInput,
  Output extends OperationOutput
> = {
  in: Input;
  out: Output;
  func: (_: Input) => Promise<Output>;
};
