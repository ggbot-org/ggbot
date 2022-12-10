// classic jsdoc is more readible
// TODO revert all jsdocs to classic style, while reviewing whole codebase

/**
 * Hook to use API actions:
 *
 * CREATE_STRATEGY, READ_ACCOUNT, WRITE_STRATEGY_FLOW, etc.
 *
 * It returns a `request` and a `response`.
 *
 * @example
 * ```ts
 * const [request, response] = useApiAction.FOO_BAR();
 * ```
 *
 * The `response` can be destructured as follow.
 *
 * @example
```ts
const [request, { data, isPending, error }] = useApiAction.FOO_BAR();
```

The `request` returns an `AbortController` that can be used in a `useEffect` destructor function;
assuming it is needed to fetch data on mount the following snippets are equivalent.

@example
```ts
const [request, response] = useApiAction.FOO_BAR();
useEffect(() => {
  const abort = request();
  return () => { abort() }
}, [request])
```

@example
```ts
const [request, response] = useApiAction.FOO_BAR();
useEffect(() => {
  return request();
}, [request])

```

If request has no params, it is even possible to do

@example
```ts
const [request, response] = useApiAction.FOO_BAR();
useEffect(request, [request])
```
*/
import {
  ErrorHTTP,
  InternalServerError,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import type {
  AccountKey,
  OperationInput,
  OperationOutput,
} from "@ggbot2/models";
import { useCallback, useState } from "react";
import {
  ApiAction,
  ApiActionError,
  ApiActionInput,
  isApiActionResponseError,
} from "_api/action";

const errorNames = ["GenericError", "Timeout", "Unauthorized"] as const;
type ErrorName = typeof errorNames[number];

type ActionError =
  | {
      name: ErrorName;
    }
  | ApiActionError;

type UseActionRequestArg<Input> = Input extends AccountKey
  ? Omit<Input, "accountId"> extends void
    ? void
    : Omit<Input, "accountId">
  : Input;

type UseActionResponse<Output extends OperationOutput> = {
  error?: ActionError | undefined;
  data?: Output | undefined;
  isPending: boolean;
};

const useAction = <
  Action extends { in: OperationInput; out: OperationOutput }
>({
  type,
}: Pick<ApiActionInput, "type">): [
  request: (arg: UseActionRequestArg<Action["in"]>) => AbortController,
  response: UseActionResponse<Action["out"]>
] => {
  const [response, setResponse] = useState<UseActionResponse<Action["out"]>>({
    isPending: false,
  });

  const request = useCallback<
    (arg: UseActionRequestArg<Action["in"]>) => AbortController
  >(
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
            console.log(responseOutput);
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

      return controller.abort;
    },
    [setResponse]
  );

  return [request, response];
};

export const useApiAction = {
  COPY_STRATEGY: () =>
    useAction<ApiAction["COPY_STRATEGY"]>({ type: "COPY_STRATEGY" }),
  CREATE_BINANCE_API_CONFIG: () =>
    useAction<ApiAction["CREATE_BINANCE_API_CONFIG"]>({
      type: "CREATE_BINANCE_API_CONFIG",
    }),
  CREATE_STRATEGY: () =>
    useAction<ApiAction["CREATE_STRATEGY"]>({ type: "CREATE_STRATEGY" }),
  DELETE_ACCOUNT: () =>
    useAction<ApiAction["DELETE_ACCOUNT"]>({ type: "DELETE_ACCOUNT" }),
  DELETE_BINANCE_API_CONFIG: () =>
    useAction<ApiAction["DELETE_BINANCE_API_CONFIG"]>({
      type: "DELETE_BINANCE_API_CONFIG",
    }),
  DELETE_STRATEGY: () =>
    useAction<ApiAction["DELETE_STRATEGY"]>({ type: "DELETE_STRATEGY" }),
  EXECUTE_STRATEGY: () =>
    useAction<ApiAction["EXECUTE_STRATEGY"]>({ type: "EXECUTE_STRATEGY" }),
  READ_ACCOUNT: () =>
    useAction<ApiAction["READ_ACCOUNT"]>({ type: "READ_ACCOUNT" }),
  READ_ACCOUNT_STRATEGIES: () =>
    useAction<ApiAction["READ_ACCOUNT_STRATEGIES"]>({
      type: "READ_ACCOUNT_STRATEGIES",
    }),
  READ_BINANCE_API_CONFIG: () =>
    useAction<ApiAction["READ_BINANCE_API_CONFIG"]>({
      type: "READ_BINANCE_API_CONFIG",
    }),
  READ_BINANCE_API_KEY_PERMISSIONS: () =>
    useAction<ApiAction["READ_BINANCE_API_KEY_PERMISSIONS"]>({
      type: "READ_BINANCE_API_KEY_PERMISSIONS",
    }),
  READ_STRATEGY: () =>
    useAction<ApiAction["READ_STRATEGY"]>({ type: "READ_STRATEGY" }),
  // TODO why not ReadStrategyBalances ?
  // ReadStrategyBalances: () => useAction<ApiAction['ReadStrategyBalances']>({ type: "ReadStrategyBalances"})
  READ_STRATEGY_BALANCES: () =>
    useAction<ApiAction["READ_STRATEGY_BALANCES"]>({
      type: "READ_STRATEGY_BALANCES",
    }),
  READ_STRATEGY_FLOW: () =>
    useAction<ApiAction["READ_STRATEGY_FLOW"]>({ type: "READ_STRATEGY_FLOW" }),
  RENAME_ACCOUNT: () =>
    useAction<ApiAction["RENAME_ACCOUNT"]>({ type: "RENAME_ACCOUNT" }),
  RENAME_STRATEGY: () =>
    useAction<ApiAction["RENAME_STRATEGY"]>({ type: "RENAME_STRATEGY" }),
  UPDATE_ACCOUNT_STRATEGIES_ITEM: () =>
    useAction<ApiAction["UPDATE_ACCOUNT_STRATEGIES_ITEM"]>({
      type: "UPDATE_ACCOUNT_STRATEGIES_ITEM",
    }),
  WRITE_STRATEGY_FLOW: () =>
    useAction<ApiAction["WRITE_STRATEGY_FLOW"]>({
      type: "WRITE_STRATEGY_FLOW",
    }),
};
