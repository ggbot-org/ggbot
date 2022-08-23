import {
  copyStrategy,
  createStrategy,
  deleteStrategy,
  readAccountStrategyList,
  readStrategy,
  readStrategyFlow,
  renameAccount,
  renameStrategy,
} from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import type {
  AccountKey,
  CopyStrategy,
  CreateStrategy,
  DeleteStrategy,
  OperationInput,
  OperationOutput,
  ReadAccount,
  ReadAccountStrategyList,
  ReadStrategy,
  ReadStrategyFlow,
  RenameAccount,
  RenameStrategy,
} from "@ggbot2/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { readSession } from "_routing";

type ApiActionInputData = OperationInput;
type ApiActionOutputData = OperationOutput;

export type ApiActionResponseOutput<T> = {
  data?: T;
};

type Action<Input, Output> = {
  // AccountKey is provided by authentication, no need to add it as action input parameter.
  in: Input extends AccountKey ? Omit<Input, "accountId"> : Input;
  out: Output;
};

export type ApiAction = {
  COPY_STRATEGY: Action<CopyStrategy["in"], CopyStrategy["out"]>;
  CREATE_STRATEGY: Action<CreateStrategy["in"], CreateStrategy["out"]>;
  DELETE_STRATEGY: Action<DeleteStrategy["in"], DeleteStrategy["out"]>;
  READ_ACCOUNT: Action<ReadAccount["in"], ReadAccount["out"]>;
  READ_ACCOUNT_STRATEGY_LIST: Action<
    ReadAccountStrategyList["in"],
    ReadAccountStrategyList["out"]
  >;
  READ_STRATEGY_FLOW: Action<ReadStrategyFlow["in"], ReadStrategyFlow["out"]>;
  READ_STRATEGY: Action<ReadStrategy["in"], ReadStrategy["out"]>;
  RENAME_ACCOUNT: Action<RenameAccount["in"], RenameAccount["out"]>;
  RENAME_STRATEGY: Action<RenameStrategy["in"], RenameStrategy["out"]>;
};

type ApiActionType = keyof ApiAction;

export type ApiActionInput = {
  type: ApiActionType;
  data?: ApiActionInputData;
};

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiActionResponseOutput<ApiActionOutputData>>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});

    const { accountId } = session;

    const action = req.body;

    switch (action.type as ApiActionType) {
      case "COPY_STRATEGY": {
        const data = await copyStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "CREATE_STRATEGY": {
        const data = await createStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "DELETE_STRATEGY": {
        const data = await deleteStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "READ_ACCOUNT_STRATEGY_LIST": {
        const data = await readAccountStrategyList({ accountId });
        return res.status(__200__OK__).json({ data });
      }

      case "READ_ACCOUNT_STRATEGY_LIST": {
        const data = await readAccountStrategyList({ accountId });
        return res.status(__200__OK__).json({ data });
      }

      case "READ_STRATEGY": {
        const data = await readStrategy(action.data);
        return res.status(__200__OK__).json({ data });
      }

      case "READ_STRATEGY_FLOW": {
        const data = await readStrategyFlow(action.data);
        return res.status(__200__OK__).json({ data });
      }

      case "RENAME_ACCOUNT": {
        const data = await renameAccount({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "RENAME_STRATEGY": {
        const data = await renameStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      default:
        return res.status(__400__BAD_REQUEST__).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
