// TODO remove swr, consider a hooks package with useApiAction
import type { DflowObject } from "dflow";
import useSWR from "swr";
import type { ApiAction } from "_api/action";

class ApiActionResponseError extends Error {
  status: number;
  constructor({ status }: Pick<ApiActionResponseError, "status">) {
    super("ApiActionResponse is not ok");
    this.status = status;
  }
}

const fetcher = async (action: DflowObject) => {
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

export const useApiAction = {
  READ_ACCOUNT: (data: ApiAction["READ_ACCOUNT"]["in"]) =>
    useSWR<ApiAction["READ_ACCOUNT"]["out"]>(
      { type: "READ_ACCOUNT", data },
      fetcher
    ),
  LIST_ACCOUNT_KEYS: () =>
    useSWR<ApiAction["LIST_ACCOUNT_KEYS"]["out"]>(
      { type: "LIST_ACCOUNT_KEYS" },
      fetcher
    ),
};
