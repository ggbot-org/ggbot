import type { DflowData } from "dflow";

export type OperationInput = DflowData | void;

export type OperationOutput = DflowData | null;

export type Operation<
  Input extends OperationInput,
  Output extends OperationOutput
> = {
  in: Input;
  out: Output;
  func: (arg: Input) => Promise<Output>;
};
