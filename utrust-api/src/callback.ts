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
  __500__INTERNAL_SERVER_ERROR__
} from "@ggbot2/http-status-codes";
import {
  WebhookValidator,
  Event as UtrustEvent,
} from "@utrustdev/utrust-ts-library";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
const { UTRUST_WEBHOOK_SECRET } = ENV;

const BAD_REQUEST: APIGatewayProxyResult = {
  body: JSON.stringify({ ok: false }),
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
};

const OK: APIGatewayProxyResult = {
  body: JSON.stringify({ ok: true }),
  isBase64Encoded: false,
  statusCode: __200__OK__,
};

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
  } catch (error) {
    console.error(error);
    return {
      body: "",
      isBase64Encoded: false,
      statusCode: __500__INTERNAL_SERVER_ERROR__,
    };
  }
};