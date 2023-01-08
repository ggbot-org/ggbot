import { useAction } from "@ggbot2/api-action";
import type { ApiAction, ApiActionType } from "_api/action";

export const useApiAction = {
  ReadAccount: () =>
    useAction<ApiAction["ReadAccount"], ApiActionType>({ type: "ReadAccount" }),
  ListAccountKeys: () =>
    useAction<ApiAction["ListAccountKeys"], ApiActionType>({
      type: "ListAccountKeys",
    }),
};
