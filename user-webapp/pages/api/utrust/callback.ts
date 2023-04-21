import {
  locatorToItemKey,
  readSubscription,
  readSubscriptionPurchase,
  writeSubscription,
  updateSubscriptionPurchaseStatus,
} from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import {
  WebhookValidator,
  Event as UtrustEvent,
} from "@utrustdev/utrust-ts-library";
import { NextApiRequest, NextApiResponse } from "next";

const { UTRUST_WEBHOOK_SECRET } = ENV;

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

    const { validateSignature } = WebhookValidator(UTRUST_WEBHOOK_SECRET);
    const input = req.body;
    const isValid = validateSignature(input);
    if (!isValid) return res.status(__400__BAD_REQUEST__).json({ ok: false });
    const {
      event_type,
      resource: { reference },
    } = input as UtrustEvent;

    // Nothing to do, the payment is detected on the blockchain.
    if (event_type === "ORDER.PAYMENT.DETECTED")
      res.status(__200__OK__).json({ ok: true });

    const purchaseKey = locatorToItemKey.subscriptionPurchase(reference);
    if (!purchaseKey)
      return res.status(__400__BAD_REQUEST__).json({ ok: false });

    if (event_type === "ORDER.PAYMENT.RECEIVED") {
      const purchase = await readSubscriptionPurchase(purchaseKey);
      const { accountId } = purchaseKey;
      const subscription = await readSubscription({ accountId });

      if (!purchase || !subscription)
        return res.status(__400__BAD_REQUEST__).json({ ok: false });

      const { plan } = subscription;
      const { end } = purchase;
      await writeSubscription({ accountId, plan, end });

      await updateSubscriptionPurchaseStatus({
        ...purchaseKey,
        status: "completed",
      });
    }

    if (event_type === "ORDER.PAYMENT.CANCELLED")
      await updateSubscriptionPurchaseStatus({
        ...purchaseKey,
        status: "canceled",
      });

    res.status(__200__OK__).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({ ok: false });
  }
}
