import {
  ApiActionInput,
  isApiActionResponseData,
  isApiActionResponseError,
} from "@ggbot2/api";
import {
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __404__NOT_FOUND__,
  __500__INTERNAL_SERVER_ERROR__,
  InternalServerError,
} from "@ggbot2/http";
import { AccountKey, OperationInput, OperationOutput } from "@ggbot2/models";
import { Reducer, useCallback, useReducer } from "react";

import { UseActionAbortController } from "./controller.js";
import { UseActionHeaders, UseActionHeadersConstructorArg } from "./headers.js";
import { UseActionReducerAction, UseActionReducerState } from "./reducer.js";

type UseActionRequestArg<Input extends OperationInput> =
  Input extends AccountKey ? Omit<Input, "accountId"> : Input;

type Request<Input extends OperationInput> = (
  arg: UseActionRequestArg<Input>
) => AbortController;

type UseActionOutput<
  Action extends { in: OperationInput; out: OperationOutput }
> = UseActionReducerState<Action["out"]> & {
  request: Request<Action["in"]>;
  isPending: boolean;
  isDone: boolean;
  reset: () => void;
};

/**
 * Hook to use API actions:
 *
 * CREATE_STRATEGY, READ_ACCOUNT, WRITE_STRATEGY_FLOW, etc.
 *
 * First, define available actions.
 *
 * @example
 *
 * ```ts
 * import {
 *   SomeApiAction as ApiAction,
 *   SomeApiActionType as ApiActionType,
 * } from "@ggbot2/api";
 * import { useAction } from "@ggbot2/use-action";
 *
 * const endpoint = "/api/action";
 *
 * const useApi = {
 *   FooBar: () =>
 *     useAction<ApiAction["FooBar"], ApiActionType>(endpoint, {
 *       type: "FooBar",
 *     }),
 * };
 * ```
 *
 * Then use defined actions.
 *
 * @example
 *
 * ```ts
 * const FooBar = useApi.FooBar();
 * ```
 *
 * It can be destructured as follow.
 *
 * @example
 *
 * ```ts
 * const { request, data, error, status } = useApi.FooBar();
 * ```
 *
 * The `request` returns an `AbortController`, it can be used as a `useEffect`
 * destructor. The `status` starts `undefined`, then can be "PENDING", "DONE",
 * "FAILED", "ABORTED". It can be also used to avoid re-triggering a
 * `useEffect`.
 *
 * @example
 *
 * ```ts
 * const FooBar = useApi.FooBar();
 * useEffect(() => {
 *   if (FooBar.status) return;
 *   const controller = request({ param });
 *   return () => {
 *     controller.abort();
 *   };
 * }, [FooBar]);
 * ```
 */
export const useAction = <
  Action extends { in: OperationInput; out: OperationOutput },
  ApiActionType extends string
>(
  { endpoint, withJwt }: { endpoint: string } & UseActionHeadersConstructorArg,
  { type }: Pick<ApiActionInput<ApiActionType>, "type">
): UseActionOutput<Action> => {
  const [{ status, data, error }, dispatch] = useReducer<
    Reducer<UseActionReducerState<Action["out"]>, UseActionReducerAction>
  >((state, action) => {
    switch (action.type) {
      case "REQUEST":
        return { status: "PENDING" };
      case "SUCCESS":
        return { status: "DONE", data: action.data };
      case "FAILURE":
        return {
          error: action.error,
          status: "FAILED",
        };
      case "TIMEOUT":
        return {
          status: "ABORTED",
          error: { name: "Timeout" },
        };
      case "ABORTED":
        return { status: "ABORTED" };
      case "RESET":
        return {};
      default:
        return state;
    }
  }, {});

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const request = useCallback<Request<Action["in"]>>(
    (arg) => {
      const controller = new UseActionAbortController();

      // Avoid call request multiple times if status is defined.
      if (status) return controller;

      // Handle timeout.
      controller.setTimeout(dispatch);

      const fetchRequest = async (inputData: Action["in"]) => {
        const options: RequestInit = {
          body:
            inputData === undefined
              ? JSON.stringify({ type })
              : JSON.stringify({ type, data: inputData }),
          headers: new UseActionHeaders({ withJwt }),
          method: "POST",
          signal: controller.signal,
        };

        dispatch({ type: "REQUEST" });
        const response = await fetch(endpoint, options);

        if (response.ok) {
          const responseOutput = await response.json();
          if (isApiActionResponseData(responseOutput))
            dispatch({
              type: "SUCCESS",
              data: responseOutput.data,
            });
        } else if (response.status === __400__BAD_REQUEST__) {
          const responseOutput = await response.json();
          if (isApiActionResponseError(responseOutput)) {
            dispatch({ type: "FAILURE", error: responseOutput.error });
          }
        } else {
          throw response.status;
        }
      };

      (async function () {
        try {
          if (controller.signal.aborted) return;
          await fetchRequest(arg);
        } catch (error) {
          switch (true) {
            case error instanceof DOMException && error.name === "AbortError": {
              // AbortError is called on component unmount and on request timeout.
              // The `status` is handled by the signal eventListener.
              break;
            }

            case error === __400__BAD_REQUEST__: {
              dispatch({
                type: "FAILURE",
                error: { name: "BadRequest" },
              });
              break;
            }

            case error === __401__UNAUTHORIZED__: {
              dispatch({
                type: "FAILURE",
                error: { name: "Unauthorized" },
              });
              break;
            }

            case error === __404__NOT_FOUND__: {
              dispatch({
                type: "FAILURE",
                error: { name: "NotFound" },
              });
              break;
            }

            case error === __500__INTERNAL_SERVER_ERROR__: {
              dispatch({
                type: "FAILURE",
                error: { name: InternalServerError.name },
              });
              break;
            }

            default: {
              console.error(error);
              dispatch({
                type: "FAILURE",
                error: { name: "GenericError" },
              });
            }
          }
        } finally {
          controller.clearTimeout();
        }
      })();

      return controller;
    },
    [endpoint, status, type, withJwt]
  );

  return {
    request,
    status,
    data,
    error,
    isPending: status === "PENDING",
    isDone: status === "DONE",
    reset,
  };
};
