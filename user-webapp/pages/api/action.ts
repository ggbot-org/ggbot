import { readAccountStrategyList } from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import type { ReadAccountStrategyList } from "@ggbot2/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { JsonValue } from "type-fest";
import { readSession } from "_routing";

type ResponseData = {
  data?: JsonValue | undefined;
};

type Action<I, O> = { in: I; out: O };

export type ApiAction = {
  READ_ACCOUNT_STRATEGY_LIST: Action<void, ReadAccountStrategyList["out"]>;
};

type ApiActionType = keyof ApiAction;

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});

    const { accountId } = session;

    const action = req.body;

    switch (action.type as ApiActionType) {
      case "READ_ACCOUNT_STRATEGY_LIST": {
        const data = await readAccountStrategyList({ accountId });
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
