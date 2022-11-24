/**
Hook to use API actions: CREATE_STRATEGY, READ_ACCOUNT, WRITE_STRATEGY_FLOW, etc.

It returns a `request` and a `response`.

@example
```ts
const [request, response] = useApiAction.FOO_BAR();
```

The `response` can be destructured as follow.

@example
```ts
const [request, { data, isPending, error }] = useApiAction.FOO_BAR();
```

The `request` returns a useEffect Destructor function; assuming it is needed to
fetch data on mount the two following snippets are equivalent.

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
useEffect(request, [request])
```
*/
import { InternalServerError } from "@ggbot2/http-status-codes";
import type { DflowData, DflowObject } from "dflow";
import { useCallback, useState } from "react";
import {
  ApiAction,
  ApiActionErrorName,
  ApiActionInput,
  ApiActionInputData,
  isApiActionResponseError,
} from "_api/action";

type ActionIO = { in: DflowObject; out: DflowData | null };

const errorNames = ["GenericError", "Timeout", "Unauthorized"] as const;
type ErrorName = typeof errorNames[number];

type ActionError = {
  name: ErrorName | ApiActionErrorName;
};

type UseActionRequestArg = ApiActionInputData;
type UseEffectDestructor = () => void;
type UseActionRequest = (arg?: UseActionRequestArg) => UseEffectDestructor;
type UseActionResponse<Action extends ActionIO> = {
  error?: ActionError | undefined;
  data?: Action["out"] | undefined;
  isPending: boolean;
};

const useAction = <Action extends ActionIO>({
  type,
}: Pick<ApiActionInput, "type">): [
  request: UseActionRequest,
  response: UseActionResponse<Action>
] => {
  const [response, setResponse] = useState<UseActionResponse<Action>>({
    isPending: false,
  });

  const request = useCallback<UseActionRequest>(
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

      const fetchRequest = async (inputData: UseActionRequestArg) => {
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
          if (status === 400) {
            const responseOutput = await response.json();
            if (isApiActionResponseError(responseOutput)) {
              setResponse({
                error: { name: responseOutput.error.name },
                isPending: false,
              });
              return;
            }
          }
          if (status === 401) {
            setResponse({ error: { name: "Unauthorized" }, isPending: false });
            return;
          }
          if (status === 500) {
            setResponse({
              error: { name: InternalServerError.name },
              isPending: false,
            });
            return;
          }
          // This error should not be thrown.
          throw new Error(`${response.status} ${response.statusText}`);
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

      return () => {
        controller.abort();
      };
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
  DELETE_STRATEGY: () =>
    useAction<ApiAction["DELETE_STRATEGY"]>({ type: "DELETE_STRATEGY" }),
  EXECUTE_STRATEGY: () =>
    useAction<ApiAction["EXECUTE_STRATEGY"]>({ type: "EXECUTE_STRATEGY" }),
  READ_ACCOUNT: () =>
    useAction<ApiAction["READ_ACCOUNT"]>({ type: "READ_ACCOUNT" }),
  READ_ACCOUNT_STRATEGY_LIST: () =>
    useAction<ApiAction["READ_ACCOUNT_STRATEGY_LIST"]>({
      type: "READ_ACCOUNT_STRATEGY_LIST",
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
  READ_STRATEGY_FLOW: () =>
    useAction<ApiAction["READ_STRATEGY_FLOW"]>({ type: "READ_STRATEGY_FLOW" }),
  RENAME_ACCOUNT: () =>
    useAction<ApiAction["RENAME_ACCOUNT"]>({ type: "RENAME_ACCOUNT" }),
  RENAME_STRATEGY: () =>
    useAction<ApiAction["RENAME_STRATEGY"]>({ type: "RENAME_STRATEGY" }),
  WRITE_STRATEGY_FLOW: () =>
    useAction<ApiAction["WRITE_STRATEGY_FLOW"]>({
      type: "WRITE_STRATEGY_FLOW",
    }),
};
