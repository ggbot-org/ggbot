import { Action, ApiActionResponseOutput } from "@ggbot2/api-action";
import { readSession } from "@ggbot2/cookies";
import {
  ErrorUnimplementedStrategyKind,
  readAccount,
  listAccountKeys,
} from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
  InternalServerError,
} from "@ggbot2/http-status-codes";
import { ReadAccount, ListAccountKeys } from "@ggbot2/models";
import { isLiteralType } from "@ggbot2/type-utils";
import { NextApiRequest, NextApiResponse } from "next";

export type ApiAction = {
  ReadAccount: Action<ReadAccount["in"]>;
  ListAccountKeys: Action<ListAccountKeys["in"]>;
};

const apiActionTypes = ["ReadAccount", "ListAccountKeys"] as const;
export type ApiActionType = (typeof apiActionTypes)[number];
const isApiActionType = isLiteralType<ApiActionType>(apiActionTypes);

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiActionResponseOutput>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const action = req.body;

    const { type: actionType } = action;

    if (!isApiActionType(actionType))
      return res.status(__400__BAD_REQUEST__).json({});

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});

    switch (actionType) {
      case "ReadAccount": {
        const data = await readAccount(action.data);
        return res.status(__200__OK__).json({ data });
      }

      case "ListAccountKeys": {
        const data = await listAccountKeys();
        return res.status(__200__OK__).json({ data });
      }

      default:
        return res.status(__400__BAD_REQUEST__).json({});
    }
  } catch (error) {
    if (error instanceof ErrorUnimplementedStrategyKind)
      return res.status(__400__BAD_REQUEST__).json({ error: error.toObject() });

    console.error(error);
    res
      .status(__500__INTERNAL_SERVER_ERROR__)
      .json({ error: { name: InternalServerError.name } });
  }
}
