/* eslint sort-keys: "error" */
import {
  AdminApiAction as ApiAction,
  AdminApiActionType as ApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

export const useApi = {
  ListAccountKeys: () =>
    useAction<ApiAction["ListAccountKeys"], ApiActionType>({
      type: "ListAccountKeys",
    }),
  ReadAccount: () =>
    useAction<ApiAction["ReadAccount"], ApiActionType>({ type: "ReadAccount" }),
};