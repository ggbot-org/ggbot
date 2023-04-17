import {
  ErrorHTTP,
  InternalServerError,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { AccountKey, OperationInput, OperationOutput } from "@ggbot2/models";
import { useCallback, useState } from "react";
import { ApiActionInput } from "./action";
import { ActionError, isApiActionResponseError } from "./errors";

type UseActionRequestArg<Input extends OperationInput> =
  Input extends AccountKey ? Omit<Input, "accountId"> : Input;

type UseActionRequest<Input extends OperationInput> = (
  arg: UseActionRequestArg<Input>
) => AbortController;

type UseActionResponse<Output extends OperationOutput> = {
  error?: ActionError | undefined;
  data?: Output | undefined;
  isPending: boolean;
};

/**
 * Hook to use API actions:
 *
 * CREATE_STRATEGY, READ_ACCOUNT, WRITE_STRATEGY_FLOW, etc.
 *
 * It returns a `request` and a `response`.
 *
 * @example
 * ```ts
 * const [request, response] = useApiAction.FooBar();
 * ```
 *
 * The `response` can be destructured as follow.
 *
 * @example
 * ```ts
 * const [request, { data, isPending, error }] = useApiAction.FooBar();
 * ```
 *
 * The `request` returns an `AbortController`, it can be used as a `useEffect` destructor.
 *
 * @example
 * ```ts
 * const [request, response] = useApiAction.FooBar();
 * useEffect(() => {
 *   const controller = request({ param });
 *   return () => { controller.abort() }
 * }, [request]);
 * ```
 *
 * It is a good to:
 * - use an uppercase name for *request*, for example `CREATE`, `READ`, `UPDATE` or `DELETE`.
 * - destructuring *response* if used.
 * - use an empty object as *request* argument if there is no parameter.
 *
 * @example
 * ```ts
 * const [DELETE, { isPending }] = useApiAction.FooBar();
 * useEffect(() => {
 *   const controller = DELETE({});
 *   return () => { controller.abort() }
 * }, [DELETE]);
 * ```
 */
export const useAction = <
  Action extends { in: OperationInput; out: OperationOutput },
  ApiActionType extends string
>({
  type,
}: Pick<ApiActionInput<ApiActionType>, "type">): [
  request: UseActionRequest<Action["in"]>,
  response: UseActionResponse<Action["out"]>
] => {
  const [response, setResponse] = useState<UseActionResponse<Action["out"]>>({
    isPending: false,
  });

  const request = useCallback<UseActionRequest<Action["in"]>>(
    (arg) => {
      const controller = new AbortController();
      const { abort, signal } = controller;
      const timeout = 10000;
      const timeoutId = setTimeout(() => {
        abort();
        setResponse({ error: { name: "Timeout" }, isPending: false });
      }, timeout);
      signal.addEventListener("abort", () => {
        setResponse({ isPending: false });
        clearTimeout(timeoutId);
      });

      const fetchRequest = async (inputData: Action["in"]) => {
        setResponse({ isPending: true });
        const body =
          inputData === undefined
            ? JSON.stringify({ type })
            : JSON.stringify({ type, data: inputData });
        const response = await fetch("/api/action", {
          body,
          credentials: "include",
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal,
        });
        if (!response.ok) {
          const { status } = response;
          if (status === __400__BAD_REQUEST__) {
            const responseOutput = await response.json();
            if (isApiActionResponseError(responseOutput)) {
              setResponse({
                error: responseOutput.error,
                isPending: false,
              });
              return;
            }
          }
          if (status === __401__UNAUTHORIZED__) {
            setResponse({ error: { name: "Unauthorized" }, isPending: false });
            return;
          }
          if (status === __500__INTERNAL_SERVER_ERROR__) {
            setResponse({
              error: { name: InternalServerError.name },
              isPending: false,
            });
            return;
          }
          // This error should not be thrown.
          throw new ErrorHTTP(response);
        }
        const responseOutput = await response.json();
        setResponse({
          data: responseOutput.data,
          isPending: false,
        });
      };

      (async function () {
        try {
          await fetchRequest(arg);
        } catch (error) {
          // AbortError is called on component unmount and on request timeout:
          // the signal eventListener on 'abort', set `isPending` to `false`.
          if (error instanceof DOMException && error.name === "AbortError")
            return;
          // Fallback for unhandled errors.
          console.error(error);
          setResponse({ error: { name: "GenericError" }, isPending: false });
        } finally {
          clearTimeout(timeoutId);
        }
      })();

      return controller;
    },
    [type]
  );

  return [request, response];
};
