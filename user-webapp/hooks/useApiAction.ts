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

The `request` returns an `AbortController`:
it can be used in a `useEffect` destructor function;
assuming it is needed to fetch data on mount the following snippets are equivalent.

@example
```ts
const [request, response] = useApiAction.FOO_BAR();
useEffect(() => {
  const controller = request({ param });
  return () => { controller.abort() }
}, [request])
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

const useAction = <
  Action extends { in: OperationInput; out: OperationOutput }
>({
  type,
}: Pick<ApiActionInput, "type">): [
  request: UseActionRequest<Action["in"]>,
  response: UseActionResponse<Action["out"]>
] => {
  const [response, setResponse] = useState<UseActionResponse<Action["out"]>>({
    isPending: false,
  });

  const request = useCallback<UseActionRequest<Action["in"]>>((arg) => {
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
  }, []);

  return [request, response];
};

export const useApiAction = {
  COPY_STRATEGY: () =>
    useAction<ApiAction["CopyStrategy"]>({ type: "CopyStrategy" }),
  CreateAccountStrategiesItemScheduling: () =>
    useAction<ApiAction["CreateAccountStrategiesItemScheduling"]>({
      type: "CreateAccountStrategiesItemScheduling",
    }),
  CreateBinanceApiConfig: () =>
    useAction<ApiAction["CreateBinanceApiConfig"]>({
      type: "CreateBinanceApiConfig",
    }),
  CreateStrategy: () =>
    useAction<ApiAction["CreateStrategy"]>({ type: "CreateStrategy" }),
  DeleteAccount: () =>
    useAction<ApiAction["DeleteAccount"]>({ type: "DeleteAccount" }),
  DeleteBinanceApiConfig: () =>
    useAction<ApiAction["DeleteBinanceApiConfig"]>({
      type: "DeleteBinanceApiConfig",
    }),
  DeleteStrategy: () =>
    useAction<ApiAction["DeleteStrategy"]>({ type: "DeleteStrategy" }),
  ExecuteStrategy: () =>
    useAction<ApiAction["ExecuteStrategy"]>({ type: "ExecuteStrategy" }),
  ReadAccount: () =>
    useAction<ApiAction["ReadAccount"]>({ type: "ReadAccount" }),
  ReadAccountStrategies: () =>
    useAction<ApiAction["ReadAccountStrategies"]>({
      type: "ReadAccountStrategies",
    }),
  ReadBinanceApiConfig: () =>
    useAction<ApiAction["ReadBinanceApiConfig"]>({
      type: "ReadBinanceApiConfig",
    }),
  ReadBinanceApiKeyPermissions: () =>
    useAction<ApiAction["ReadBinanceApiKeyPermissions"]>({
      type: "ReadBinanceApiKeyPermissions",
    }),
  ReadStrategy: () =>
    useAction<ApiAction["ReadStrategy"]>({ type: "ReadStrategy" }),
  ReadStrategyBalances: () =>
    useAction<ApiAction["ReadStrategyBalances"]>({
      type: "ReadStrategyBalances",
    }),
  ReadStrategyFlow: () =>
    useAction<ApiAction["ReadStrategyFlow"]>({ type: "ReadStrategyFlow" }),
  RemoveAccountStrategiesItemSchedulings: () =>
    useAction<ApiAction["RemoveAccountStrategiesItemSchedulings"]>({
      type: "RemoveAccountStrategiesItemSchedulings",
    }),
  RenameAccount: () =>
    useAction<ApiAction["RenameAccount"]>({ type: "RenameAccount" }),
  RenameStrategy: () =>
    useAction<ApiAction["RenameStrategy"]>({ type: "RenameStrategy" }),
  WriteStrategyFlow: () =>
    useAction<ApiAction["WriteStrategyFlow"]>({
      type: "WriteStrategyFlow",
    }),
};
