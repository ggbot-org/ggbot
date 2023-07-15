/* eslint sort-keys: "error" */
import {
  AdminApiAction,
  AdminApiActionType,
  PublicApiAction,
  PublicApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const adminApiOptions = {
  endpoint: url.apiAdminAction,
  withJwt: true,
};

export const useApi = {
  ListAccountKeys: () =>
    useAction<AdminApiAction["ListAccountKeys"], AdminApiActionType>(
      adminApiOptions,
      {
        type: "ListAccountKeys",
      }
    ),
  ReadAccount: () =>
    useAction<AdminApiAction["ReadAccount"], AdminApiActionType>(
      adminApiOptions,
      {
        type: "ReadAccount",
      }
    ),
  ReadStrategy: () =>
    useAction<PublicApiAction["ReadStrategy"], PublicApiActionType>(
      adminApiOptions,
      {
        type: "ReadStrategy",
      }
    ),
  ReadStrategyFlow: () =>
    useAction<PublicApiAction["ReadStrategyFlow"], PublicApiActionType>(
      adminApiOptions,
      {
        type: "ReadStrategyFlow",
      }
    ),
};
