import useSWR from "swr";
import { JsonObject } from "type-fest";
import type { ApiAction, ApiActionInput } from "_api/action";

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

export type CREATE_STRATEGY_IN = ApiAction["CREATE_STRATEGY"]["in"] | undefined;

function useAction<Output>(arg: ApiActionInput | null) {
  const { error, data } = useSWR<Output>(arg, fetcher);
  const isLoading = arg !== null && !error && !data;
  return { error, data, isLoading };
}

export const useApiAction = {
  CREATE_STRATEGY: (data?: CREATE_STRATEGY_IN) =>
    useAction<ApiAction["CREATE_STRATEGY"]["out"]>(
      data ? { type: "CREATE_STRATEGY", data } : null
    ),
  READ_ACCOUNT_STRATEGY_LIST: () =>
    useAction<ApiAction["READ_ACCOUNT_STRATEGY_LIST"]["out"]>({
      type: "READ_ACCOUNT_STRATEGY_LIST",
    }),
};
