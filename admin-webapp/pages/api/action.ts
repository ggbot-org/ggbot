import { readAccount, readAccountKeys } from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import type { ReadAccount, ReadAccountKeys } from "@ggbot2/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { DflowData } from "dflow";

type ResponseData = {
  data?: DflowData | undefined;
};

type Action<I, O> = { in: I; out: O };

export type ApiAction = {
  READ_ACCOUNT: Action<ReadAccount["in"], ReadAccount["out"]>;
  READ_ACCOUNT_KEYS: Action<ReadAccountKeys["in"], ReadAccountKeys["out"]>;
};

type ApiActionType = keyof ApiAction;

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const action = req.body;

    switch (action.type as ApiActionType) {
      case "READ_ACCOUNT": {
        const data = await readAccount(action.data);
        return res.status(__200__OK__).json({ data });
      }

      case "READ_ACCOUNT_KEYS": {
        const data = await readAccountKeys();
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
