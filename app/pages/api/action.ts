import { ApiActionResponseOutput } from "@ggbot2/api";
import { readSession } from "@ggbot2/cookies";
import {
  copyStrategy,
  createBinanceApiConfig,
  createStrategy,
  deleteAccount,
  deleteBinanceApiConfig,
  deleteStrategy,
  executeStrategy,
  readAccount,
  readAccountStrategies,
  readBinanceApiConfig,
  readBinanceApiKeyPermissions,
  readStrategy,
  readStrategyBalances,
  readStrategyFlow,
  readStrategyOrders,
  readSubscription,
  renameAccount,
  renameStrategy,
  setAccountCountry,
  writeAccountStrategiesItemSchedulings,
  writeStrategyFlow,
} from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
  InternalServerError,
} from "@ggbot2/http-status-codes";
import {
  ErrorAccountItemNotFound,
  ErrorExceededQuota,
  ErrorUnimplementedStrategyKind,
} from "@ggbot2/models";
import { NextApiRequest, NextApiResponse } from "next";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiActionResponseOutput>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const action = req.body;

    const { type: actionType } = action;

    if (!isUserApiActionType(actionType))
      return res.status(__400__BAD_REQUEST__).json({});

    // Actions that do not require authentication.
    // //////////////////////////////////////////

    switch (actionType) {
      case "ReadStrategyFlow": {
        const data = await readStrategyFlow(action.data);
        return res.status(__200__OK__).json({ data });
      }

      default:
        break;
    }

    // Actions that require authentication.
    // ///////////////////////////////////

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});
    const { accountId } = session;

  } catch (error) {
    if (
      error instanceof ErrorAccountItemNotFound ||
      error instanceof ErrorExceededQuota ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      return res.status(__400__BAD_REQUEST__).json({ error: error.toObject() });

    console.error(error);
    res
      .status(__500__INTERNAL_SERVER_ERROR__)
      .json({ error: { name: InternalServerError.name } });
  }
}
