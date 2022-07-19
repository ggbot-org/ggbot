import useSWR from "swr";
import { JsonObject } from "type-fest";
import type { ApiAction } from "_api/action";

class ApiActionResponseError extends Error {
  status: number;
  constructor({ status }: Pick<ApiActionResponseError, "status">) {
    super("ApiActionResponse is not ok");
    this.status = status;
  }
}

async function fetcher(action: JsonObject) {
  try {
    const body = JSON.stringify(action);
    const response = await fetch("/api/action", {
      body,
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
}

export const useApiAction = {
  READ_ACCOUNT: (data: ApiAction["READ_ACCOUNT"]["input"]) =>
    useSWR<ApiAction["READ_ACCOUNT"]["output"]>(
      { type: "READ_ACCOUNT", data },
      fetcher
    ),
  READ_ACCOUNT_KEYS: () =>
    useSWR<ApiAction["READ_ACCOUNT_KEYS"]["output"]>(
      { type: "READ_ACCOUNT_KEYS" },
      fetcher
    ),
};
