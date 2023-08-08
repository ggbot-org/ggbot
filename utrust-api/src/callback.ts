import { ApiUtrustCallabackRequestData } from "@ggbot2/api";
import {
  APIGatewayProxyHandler,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
} from "@ggbot2/api-gateway";
import {
  locatorToItemKey,
  readSubscription,
  readSubscriptionPurchase,
  updateSubscriptionPurchaseStatus,
  writeSubscription,
} from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  Event as UtrustEvent,
  WebhookValidator,
} from "@utrustdev/utrust-ts-library";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    switch (event.httpMethod) {
      case "POST": {
        if (!event.body) return BAD_REQUEST();

        const { validateSignature } = WebhookValidator(
          ENV.UTRUST_WEBHOOK_SECRET
        );
        const input = JSON.parse(event.body);
        const isValid = validateSignature(input);
        if (!isValid) return BAD_REQUEST();

        const {
          event_type,
          resource: { reference },
        } = input as UtrustEvent;

        // Nothing to do, the payment is detected on the blockchain.
        if (event_type === "ORDER.PAYMENT.DETECTED") {
          const output: ApiUtrustCallabackRequestData = { ok: true };
          return OK(output);
        }

        const purchaseKey = locatorToItemKey.subscriptionPurchase(reference);
        if (!purchaseKey) return BAD_REQUEST();

        if (event_type === "ORDER.PAYMENT.RECEIVED") {
          const purchase = await readSubscriptionPurchase(purchaseKey);
          const { accountId } = purchaseKey;
          const subscription = await readSubscription({ accountId });

          if (!purchase || !subscription) return BAD_REQUEST();

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

        const output: ApiUtrustCallabackRequestData = { ok: false };
        return OK(output);
      }

      default:
        return METHOD_NOT_ALLOWED;
    }
  } catch (error) {
    console.error(error);
  }
  return INTERNAL_SERVER_ERROR;
};
