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
} from "@ggbot2/http-status-codes";
import {
  WebhookValidator,
  Event as UtrustEvent,
} from "@utrustdev/utrust-ts-library";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const { UTRUST_WEBHOOK_SECRET } = ENV;

const BAD_REQUEST = {
  statusCode: __400__BAD_REQUEST__,
  body: JSON.stringify({ ok: false }),
};

const OK = {
  statusCode: __200__OK__,
  body: JSON.stringify({ ok: true }),
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "POST": {
      if (!event.body) return BAD_REQUEST;

      const { validateSignature } = WebhookValidator(UTRUST_WEBHOOK_SECRET);
      const input = JSON.parse(event.body);
      const isValid = validateSignature(input);
      if (!isValid) return BAD_REQUEST;

      const {
        event_type,
        resource: { reference },
      } = input as UtrustEvent;

      // Nothing to do, the payment is detected on the blockchain.
      if (event_type === "ORDER.PAYMENT.DETECTED") return OK;

      const purchaseKey = locatorToItemKey.subscriptionPurchase(reference);
      if (!purchaseKey) return BAD_REQUEST;

      if (event_type === "ORDER.PAYMENT.RECEIVED") {
        const purchase = await readSubscriptionPurchase(purchaseKey);
        const { accountId } = purchaseKey;
        const subscription = await readSubscription({ accountId });

        if (!purchase || !subscription) return BAD_REQUEST;

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

      return OK;
    }

    default: {
      return {
        statusCode: __405__METHOD_NOT_ALLOWED__,
        body: JSON.stringify({}),
      };
    }
  }
};
