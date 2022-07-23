import { readAccount, readAccountKeys } from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggobt2/http-status-codes";
import type { ReadAccount, ReadAccountKeys } from "@ggbot2/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { JsonValue } from "type-fest";

type ResponseData = JsonValue;

type Action<Input, Output> = {
  input: Input;
  output: Output;
};

export type ApiAction = {
  READ_ACCOUNT: Action<ReadAccount["input"], ReadAccount["output"]>;
  READ_ACCOUNT_KEYS: Action<
    ReadAccountKeys["input"],
    ReadAccountKeys["output"]
  >;
};

type ApiActionType = keyof ApiAction;

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method !== "POST") return res.status(__405__METHOD_NOT_ALLOWED__);

    const action = req.body;

    switch (action.type as ApiActionType) {
      case "READ_ACCOUNT": {
        const output = await readAccount(action.data);
        return res.status(__200__OK__).json(output);
      }

      case "READ_ACCOUNT_KEYS": {
        const output = await readAccountKeys();
        return res.status(__200__OK__).json(output);
      }

      default:
        return res.status(__400__BAD_REQUEST__).json(null);
    }
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
