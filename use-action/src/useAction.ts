import {
  ApiActionClientSideError,
  ApiActionInput,
  ApiActionServerSideError,
  isApiActionResponseData,
  isApiActionResponseError,
} from "@ggbot2/api";
import {
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __404__NOT_FOUND__,
  __500__INTERNAL_SERVER_ERROR__,
  __502__BAD_GATEWAY__,
  BadGatewayError,
  InternalServerError,
} from "@ggbot2/http";
import { AccountKey, OperationInput, OperationOutput } from "@ggbot2/models";
import { useCallback, useState } from "react";

import { UseActionAbortController } from "./controller.js";
import { UseActionHeaders, UseActionHeadersConstructorArg } from "./headers.js";

type UseActionRequestArg<Input extends OperationInput> =
  Input extends AccountKey ? Omit<Input, "accountId"> : Input;

type UseActionRequest<Input extends OperationInput> = (
  arg?: UseActionRequestArg<Input> | undefined
) => void;

type UseActionOutput<
  Action extends { in: OperationInput; out: OperationOutput }
> = {
  error: ApiActionClientSideError | ApiActionServerSideError | undefined;
  data: Action["out"] | undefined;
  request: UseActionRequest<Action["in"]>;
  canRun: boolean;
  hasError: boolean | undefined;
  isPending: boolean | undefined;
  isDone: boolean | undefined;
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
 * export const FooBar = useAction<ApiAction["FooBar"], ApiActionType>(
 *   endpoint,
 *   { type: "FooBar" }
 * );
 * ```
 *
 * Then call it in a `useEffect`.
 *
 * @example
 *
 * ```ts
 * useEffect(() => {
 *   if (FooBar.canRun) FooBar.request({ param });
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
  const [data, setData] = useState<Action["out"] | undefined>();
  const [error, setError] = useState<
    ApiActionClientSideError | ApiActionServerSideError | undefined
  >();
  const [isPending, setIsPending] = useState<boolean | undefined>();

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
    setIsPending(undefined);
  }, []);

  const request = useCallback<UseActionRequest<Action["in"]>>(
    (inputData) => {
      (async function () {
        const controller = new UseActionAbortController();

        try {
          const options: RequestInit = {
            body: JSON.stringify({ type, data: inputData }),
            headers: new UseActionHeaders({ withJwt }),
            method: "POST",
            signal: controller.signal,
          };

          setIsPending(true);
          const response = await fetch(endpoint, options);

          if (response.ok) {
            const responseOutput = await response.json();
            if (isApiActionResponseData(responseOutput))
              setData(responseOutput.data);
          } else if (response.status === __400__BAD_REQUEST__) {
            const responseOutput = await response.json();
            if (isApiActionResponseError(responseOutput))
              setError(responseOutput.error);
          } else {
            throw response.status;
          }
        } catch (error) {
          switch (true) {
            case error instanceof DOMException && error.name === "AbortError": {
              // This AbortError is called on component unmount.
              break;
            }

            case controller.signal.aborted: {
              setError({ name: "Timeout" });
              break;
            }

            case error === __400__BAD_REQUEST__: {
              setError({ name: "BadRequest" });
              break;
            }

            case error === __401__UNAUTHORIZED__: {
              setError({ name: "Unauthorized" });
              break;
            }

            case error === __404__NOT_FOUND__: {
              setError({ name: "NotFound" });
              break;
            }

            case error === __500__INTERNAL_SERVER_ERROR__: {
              setError({ name: InternalServerError.name });
              break;
            }

            case error === __502__BAD_GATEWAY__: {
              setError({ name: BadGatewayError.name });
              break;
            }

            default: {
              console.error(error);
              setError({ name: "GenericError" });
            }
          }
        } finally {
          controller.clearTimeout();
          setIsPending(false);
        }
      })();
    },
    [endpoint, type, withJwt]
  );

  const isDone = data !== undefined;
  const hasError = error !== undefined;
  const canRun = [hasError, isDone, isPending].every((item) => !item);

  return {
    canRun,
    data,
    error,
    hasError,
    isDone,
    isPending,
    request,
    reset,
  };
};
