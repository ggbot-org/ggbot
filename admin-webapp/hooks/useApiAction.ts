import useSWR from "swr";
import { JsonObject } from "type-fest";

type Action = {
  type: string;
  data?: JsonObject;
};

class ApiActionResponseError extends Error {
  status: number;
  constructor({ status }: Pick<ApiActionResponseError, "status">) {
    super("ApiActionResponse is not ok");
    this.status = status;
  }
}

async function fetcher(action: Action) {
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

export const useApiAction = (action: Action) => {
  return useSWR(action, fetcher);
};
