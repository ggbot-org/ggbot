/* eslint sort-keys: "error" */
import {
  AdminApiAction,
  AdminApiActionType,
  PublicApiAction,
  PublicApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const endpoint = url.apiAdminAction;

export const useApi = {
  ListAccountKeys: () =>
    useAction<AdminApiAction["ListAccountKeys"], AdminApiActionType>(endpoint, {
      type: "ListAccountKeys",
    }),
  ReadAccount: () =>
    useAction<AdminApiAction["ReadAccount"], AdminApiActionType>(endpoint, {
      type: "ReadAccount",
    }),
  ReadStrategy: () =>
    useAction<PublicApiAction["ReadStrategy"], PublicApiActionType>(endpoint, {
      type: "ReadStrategy",
    }),
  ReadStrategyFlow: () =>
    useAction<PublicApiAction["ReadStrategyFlow"], PublicApiActionType>(
      endpoint,
      {
        type: "ReadStrategyFlow",
      }
    ),
};
