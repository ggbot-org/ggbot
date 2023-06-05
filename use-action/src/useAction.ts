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
import { useCallback, useState } from "react";

type UseActionRequestArg<Input extends OperationInput> =
  Input extends AccountKey ? Omit<Input, "accountId"> : Input;

type UseActionRequest<Input extends OperationInput> = (
  arg: UseActionRequestArg<Input>
) => AbortController;

type UseActionResponse<Output extends OperationOutput> = {
  aborted?: boolean | undefined;
  error?: ApiActionClientSideError | ApiActionServerSideError | undefined;
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
 *
 * ```ts
 * const [request, response] = useApiAction.FooBar();
 * ```
 *
 * The `response` can be destructured as follow.
 *
 * @example
 *
 * ```ts
 * const [request, { data, isPending, error }] = useApiAction.FooBar();
 * ```
 *
 * The `request` returns an `AbortController`, it can be used as a `useEffect`
 * destructor.
 *
 * @example
 *
 * ```ts
 * const [request, response] = useApiAction.FooBar();
 * useEffect(() => {
 *   const controller = request({ param });
 *   return () => {
 *     controller.abort();
 *   };
 * }, [request]);
 * ```
 *
 * It is a good to:
 *
 * - Use an uppercase name for _request_, for example `CREATE`, `READ`, `UPDATE`
 *   or `DELETE`.
 * - Destructuring _response_ if used.
 * - Use an empty object as _request_ argument if there is no parameter.
 *
 *
 * @example
 *
 * ```ts
 * const [DELETE, { isPending }] = useApiAction.FooBar();
 * useEffect(() => {
 *   const controller = DELETE({});
 *   return () => {
 *     controller.abort();
 *   };
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
        setResponse({
          aborted: true,
          error: { name: "Timeout" },
          isPending: false,
        });
      }, timeout);
      signal.addEventListener("abort", () => {
        setResponse({ aborted: true, isPending: false });
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

        const { ok, status } = response;

        if (ok) {
          const responseOutput = await response.json();
          setResponse({
            data: responseOutput.data,
            isPending: false,
          });
        } else if (status === __400__BAD_REQUEST__) {
          const responseOutput = await response.json();
          if (isApiActionResponseError(responseOutput)) {
            setResponse({
              error: responseOutput.error,
              isPending: false,
            });
          }
        } else {
          throw status;
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
              // The `isPending` status is handled by the signal eventListener:
              // on 'abort' event, it set `isPending` to `false`.
              break;
            }

            case error === __400__BAD_REQUEST__: {
              setResponse({
                error: { name: "BadRequest" },
                isPending: false,
              });
              break;
            }

            case error === __401__UNAUTHORIZED__: {
              setResponse({
                error: { name: "Unauthorized" },
                isPending: false,
              });
              break;
            }

            case error === __404__NOT_FOUND__: {
              setResponse({
                error: { name: "NotFound" },
                isPending: false,
              });
              break;
            }

            case error === __500__INTERNAL_SERVER_ERROR__: {
              setResponse({
                error: { name: InternalServerError.name },
                isPending: false,
              });
              break;
            }

            default: {
              console.error(error);
              setResponse({
                error: { name: "GenericError" },
                isPending: false,
              });
            }
          }
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
