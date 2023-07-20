import {
  ApiActionClientSideError,
  ApiActionInput,
  ApiActionServerSideError,
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
import { localWebStorage } from "@ggbot2/web-storage";
import { useCallback, useState } from "react";

type UseActionRequestArg<Input extends OperationInput> =
  Input extends AccountKey ? Omit<Input, "accountId"> : Input;

type UseActionRequest<Input extends OperationInput> = (
  arg: UseActionRequestArg<Input>
) => AbortController;

type UseActionStatus = "PENDING" | "DONE" | "FAILED" | "ABORTED";

type UseActionResult<Output extends OperationOutput> = Partial<{
  status: UseActionStatus;
  error: ApiActionClientSideError | ApiActionServerSideError;
  data: Output;
}>;

type UseActionOutput<
  Action extends { in: OperationInput; out: OperationOutput }
> = UseActionResult<Action["out"]> & {
  request: UseActionRequest<Action["in"]>;
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
  { endpoint, withJwt }: { endpoint: string; withJwt?: boolean },
  { type }: Pick<ApiActionInput<ApiActionType>, "type">
): UseActionOutput<Action> & {
  isPending: boolean;
  isDone: boolean;
  reset: () => void;
} => {
  const [{ status, data, error }, setResult] = useState<
    UseActionResult<Action["out"]>
  >({});

  const reset = useCallback(() => {
    setResult({});
  }, []);

  const request = useCallback<UseActionRequest<Action["in"]>>(
    (arg) => {
      const controller = new AbortController();

      // Avoid call request multiple times if status is defined.
      if (status) return controller;

      // Handle timeout.
      const { abort, signal } = controller;
      const timeout = 10000;
      const timeoutId = setTimeout(() => {
        abort();
        setResult({
          status: "ABORTED",
          error: { name: "Timeout" },
        });
      }, timeout);
      signal.addEventListener("abort", () => {
        setResult({ status: "ABORTED" });
        clearTimeout(timeoutId);
      });

      const fetchRequest = async (inputData: Action["in"]) => {
        const headers = new Headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        });
        if (withJwt) {
          const { jwt } = localWebStorage;
          headers.append("Authorization", `Bearer ${jwt}`);
        }

        const body =
          inputData === undefined
            ? JSON.stringify({ type })
            : JSON.stringify({ type, data: inputData });

        const options: RequestInit = {
          body,
          headers,
          method: "POST",
          signal,
        };
        if (withJwt) options.credentials = "include";

        setResult({ status: "PENDING" });
        const response = await fetch(endpoint, options);

        if (response.ok) {
          const responseOutput = await response.json();
          setResult({
            data: responseOutput.data,
            status: "DONE",
          });
        } else if (response.status === __400__BAD_REQUEST__) {
          const responseOutput = await response.json();
          if (isApiActionResponseError(responseOutput)) {
            setResult({
              error: responseOutput.error,
              status: "FAILED",
            });
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
              setResult({
                error: { name: "BadRequest" },
                status: "FAILED",
              });
              break;
            }

            case error === __401__UNAUTHORIZED__: {
              setResult({
                error: { name: "Unauthorized" },
                status: "FAILED",
              });
              break;
            }

            case error === __404__NOT_FOUND__: {
              setResult({
                error: { name: "NotFound" },
                status: "FAILED",
              });
              break;
            }

            case error === __500__INTERNAL_SERVER_ERROR__: {
              setResult({
                error: { name: InternalServerError.name },
                status: "FAILED",
              });
              break;
            }

            default: {
              console.error(error);
              setResult({
                error: { name: "GenericError" },
                status: "FAILED",
              });
            }
          }
        } finally {
          clearTimeout(timeoutId);
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
