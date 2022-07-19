import { readAccount, readAccountKeys } from "@ggbot2/database";
import type { ReadAccount, ReadAccountKeys } from "@ggbot2/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { JsonValue } from "type-fest";

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

export default async function apiActionHandler(
  req: NextApiRequest,
  res: NextApiResponse<JsonValue>
) {
  try {
    if (req.method !== "POST") return res.status(405);

    const action = req.body;

    switch (action.type as ApiActionType) {
      case "READ_ACCOUNT": {
        const output = await readAccount(action.data);
        return res.status(200).json(output);
      }

      case "READ_ACCOUNT_KEYS": {
        const output = await readAccountKeys();
        return res.status(200).json(output);
      }

      default:
        res.status(406).json(null);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
}
