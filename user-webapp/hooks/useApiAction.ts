import useSWR from "swr";
import { JsonObject } from "type-fest";
import type {
  ApiAction,
  ApiActionResponseOutput,
  ApiActionInput,
} from "_api/action";

export type { ApiAction } from "_api/action";

class ApiActionResponseError extends Error {
  status: number;
  constructor({ status }: Pick<ApiActionResponseError, "status">) {
    super("ApiActionResponse is not ok");
    this.status = status;
  }
}

const fetcher = async (action: JsonObject) => {
  try {
    const body = JSON.stringify(action);
    const response = await fetch("/api/action", {
      body,
      credentials: "include",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      method: "POST",
    });
    if (!response.ok) {
      throw new ApiActionResponseError({ status: response.status });
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

function useAction<OutputData>(arg: ApiActionInput | null) {
  const { error, data: responseOutput } = useSWR<
    ApiActionResponseOutput<OutputData>
  >(arg, fetcher);
  const isLoading = arg !== null && !error && !responseOutput;
  const data = responseOutput?.data;
  return { error, data, isLoading };
}

export const useApiAction = {
  COPY_STRATEGY: (data?: ApiAction["COPY_STRATEGY"]["in"]) =>
    useAction<ApiAction["COPY_STRATEGY"]["out"]>(
      data ? { type: "COPY_STRATEGY", data } : null
    ),
  CREATE_BINANCE_API_CONFIG: (
    data?: ApiAction["CREATE_BINANCE_API_CONFIG"]["in"]
  ) =>
    useAction<ApiAction["CREATE_BINANCE_API_CONFIG"]["out"]>(
      data ? { type: "CREATE_BINANCE_API_CONFIG", data } : null
    ),
  CREATE_STRATEGY: (data?: ApiAction["CREATE_STRATEGY"]["in"]) =>
    useAction<ApiAction["CREATE_STRATEGY"]["out"]>(
      data ? { type: "CREATE_STRATEGY", data } : null
    ),
  DELETE_STRATEGY: (data?: ApiAction["DELETE_STRATEGY"]["in"]) =>
    useAction<ApiAction["DELETE_STRATEGY"]["out"]>(
      data ? { type: "DELETE_STRATEGY", data } : null
    ),
  READ_ACCOUNT: () =>
    useAction<ApiAction["READ_ACCOUNT"]["out"]>({
      type: "READ_ACCOUNT",
    }),
  READ_ACCOUNT_STRATEGY_LIST: () =>
    useAction<ApiAction["READ_ACCOUNT_STRATEGY_LIST"]["out"]>({
      type: "READ_ACCOUNT_STRATEGY_LIST",
    }),
  READ_BINANCE_API_CONFIG: () =>
    useAction<ApiAction["READ_BINANCE_API_CONFIG"]["out"]>({
      type: "READ_BINANCE_API_CONFIG",
    }),
  READ_STRATEGY: (data?: ApiAction["READ_STRATEGY"]["in"]) =>
    useAction<ApiAction["READ_STRATEGY"]["out"]>(
      data ? { type: "READ_STRATEGY", data } : null
    ),
  READ_STRATEGY_FLOW: (data?: ApiAction["READ_STRATEGY_FLOW"]["in"]) =>
    useAction<ApiAction["READ_STRATEGY_FLOW"]["out"]>(
      data ? { type: "READ_STRATEGY_FLOW", data } : null
    ),
  RENAME_ACCOUNT: (data?: ApiAction["RENAME_ACCOUNT"]["in"]) =>
    useAction<ApiAction["RENAME_ACCOUNT"]["out"]>(
      data ? { type: "RENAME_ACCOUNT", data } : null
    ),
  RENAME_STRATEGY: (data?: ApiAction["RENAME_STRATEGY"]["in"]) =>
    useAction<ApiAction["RENAME_STRATEGY"]["out"]>(
      data ? { type: "RENAME_STRATEGY", data } : null
    ),
};
