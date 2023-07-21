import {
  ApiActionClientSideError,
  ApiActionResponseData,
  ApiActionServerSideError,
} from "@ggbot2/api";
import { OperationOutput } from "@ggbot2/models";

export type UseActionReducerState<Output extends OperationOutput> = Partial<{
  status: "PENDING" | "DONE" | "FAILED" | "ABORTED";
  error: ApiActionClientSideError | ApiActionServerSideError;
  data: Output;
}>;

export type UseActionReducerActionTimeout = { type: "TIMEOUT" };
export type UseActionReducerActionAborted = { type: "ABORTED" };

export type UseActionReducerAction =
  | {
      type: "REQUEST";
    }
  | {
      type: "FAILURE";
      error: ApiActionClientSideError | ApiActionServerSideError;
    }
  | ({ type: "SUCCESS" } & ApiActionResponseData)
  | { type: "RESET" }
  | UseActionReducerActionAborted
  | UseActionReducerActionTimeout;
