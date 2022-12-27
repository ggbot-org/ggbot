import {
  locatorToItemKey,
  readSubscription,
  updateSubscriptionPurchaseStatus,
} from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  ok: boolean;
};

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Handle HTTP method
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({ ok: false });

    const input = req.body;
    // TODO check what utrust returns
    console.log(input);

    // TODO const {reference} = input
    const reference = "";
    const purchaseKey = locatorToItemKey.subscriptionPurchase(reference);
    await updateSubscriptionPurchaseStatus({
      ...purchaseKey,
      status: "completed",
    });
    // TODO status canceled

    res.status(__200__OK__).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({ ok: false });
  }
}
