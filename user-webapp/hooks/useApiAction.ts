import { useCallback, useState } from "react";
import { JsonValue, JsonObject } from "type-fest";
import {
  ApiAction,
  ApiActionBadRequestName,
  ApiActionInput,
  isApiActionResponseToBadRequest,
} from "_api/action";

type ActionIO = { in: JsonObject; out: JsonValue };

const errorNames = ["GenericError", "Timeout", "Unauthorized"] as const;
type ErrorName = typeof errorNames[number];

type UseActionRequest = (arg: Pick<ApiActionInput, "data">) => Promise<void>;
type UseActionResponse<Action extends ActionIO> = {
  error?: ErrorName | ApiActionBadRequestName | undefined;
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
    async ({ data: inputData }) => {
      const timeout = 10000;
      const timeoutId = setTimeout(() => {
        controller.abort();
        setResponse({ error: "Timeout", isPending: false });
      }, timeout);
      const controller = new AbortController();

      try {
        setResponse({ isPending: true });

        const body =
          typeof inputData === "undefined"
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
          signal: controller.signal,
        });
        if (!response.ok) {
          const { status } = response;
          if (status === 400) {
            const responseOutput = await response.json();
            if (isApiActionResponseToBadRequest(responseOutput)) {
              setResponse({ error: responseOutput.error, isPending: false });
              return;
            }
          }
          if (status === 401) {
            setResponse({ error: "Unauthorized", isPending: false });
            return;
          }
          if (status === 500) {
            setResponse({ error: "GenericError", isPending: false });
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
      } catch (error) {
        console.error(error);
        setResponse({ error: "GenericError", isPending: false });
      } finally {
        clearTimeout(timeoutId);
      }
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
