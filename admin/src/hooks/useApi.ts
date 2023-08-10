import { AdminApiActionType, PublicApiActionType } from "@ggbot2/api";
import {
  // ListAccountKeys,
  ReadAccount,
  ReadStrategy,
  ReadStrategyFlow,
} from "@ggbot2/models";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const publicApiOptions = { endpoint: url.apiPublicAction };
const adminApiOptions = {
  endpoint: url.apiAdminAction,
  withJwt: true,
};

const publicApi = {
  ReadStrategy: () =>
    useAction<ReadStrategy, PublicApiActionType>(
      publicApiOptions,
      "ReadStrategy"
    ),
  ReadStrategyFlow: () =>
    useAction<ReadStrategyFlow, PublicApiActionType>(
      publicApiOptions,
      "ReadStrategyFlow"
    ),
};

export const adminApi = {
  // ListAccountKeys: () =>
  //   useAction<ListAccountKeys, AdminApiActionType>(
  //     adminApiOptions,
  //     "ListAccountKeys"
  //   ),
  ReadAccount: () =>
    useAction<ReadAccount, AdminApiActionType>(adminApiOptions, "ReadAccount"),
};

export const useApi = {
  ...publicApi,
  ...adminApi,
};
