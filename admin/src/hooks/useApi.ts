/* eslint sort-keys: "error" */
import {
  AdminApiAction as ApiAction,
  AdminApiActionType as ApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const endpoint = url.apiAdminAction;

export const useApi = {
  ListAccountKeys: () =>
    useAction<ApiAction["ListAccountKeys"], ApiActionType>(endpoint, {
      type: "ListAccountKeys",
    }),
  ReadAccount: () =>
    useAction<ApiAction["ReadAccount"], ApiActionType>(endpoint, {
      type: "ReadAccount",
    }),
};
