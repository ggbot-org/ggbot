/* eslint sort-keys: "error" */
import {
  AdminApiAction,
  AdminApiActionType,
  PublicApiAction,
  PublicApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const publicApiOptions = { endpoint: url.apiPublicAction };
const adminApiOptions = {
  endpoint: url.apiAdminAction,
  withJwt: true,
};

const publicApi = {
  ReadStrategy: () =>
    useAction<PublicApiAction["ReadStrategy"], PublicApiActionType>(
      publicApiOptions,
      {
        type: "ReadStrategy",
      }
    ),
  ReadStrategyFlow: () =>
    useAction<PublicApiAction["ReadStrategyFlow"], PublicApiActionType>(
      publicApiOptions,
      {
        type: "ReadStrategyFlow",
      }
    ),
};

export const adminApi = {
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
};

export const useApi = {
  ...publicApi,
  ...adminApi,
};
