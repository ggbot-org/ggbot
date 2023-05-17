import {
  ApiUtrustOrderResponseData,
  isApiUtrustOrderRequestData,
} from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
} from "@ggbot2/api-gateway";
import {
  itemKeyToDirname,
  readSubscription,
  createYearlySubscriptionPurchase,
  createMonthlySubscriptionPurchase,
  updateSubscriptionPurchaseInfo,
} from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  ApiBaseURL,
  UserWebappBaseURL,
  UtrustCancelURL,
  UtrustCallbackURL,
  UtrustReturnURL,
} from "@ggbot2/locators";
import {
  PaymentProvider,
  SubscriptionPlan,
  monthlyPriceCurrency,
  purchaseMaxNumMonths as maxNumMonths,
  totalPurchase,
  isSubscription,
  subscriptionStatus,
} from "@ggbot2/models";
import { today, getDate, dayToDate, dateToDay } from "@ggbot2/time";
import { ApiClient, Order, Customer } from "@utrustdev/utrust-ts-library";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { DEPLOY_STAGE, UTRUST_API_KEY } = ENV;

    const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);
    const apiBaseURL = new ApiBaseURL(DEPLOY_STAGE);
    const callbackUrl = new UtrustCallbackURL(apiBaseURL.toString());
    const cancelUrl = new UtrustCancelURL(userWebappBaseURL.toString());
    const returnUrl = new UtrustReturnURL(userWebappBaseURL.toString());

    // UTRUST_API_KEY starts with
    // - u_test_api_ on sandbox environment
    // - u_live_api_ on production environment
    const UTRUST_ENVIRONMENT = UTRUST_API_KEY.startsWith("u_live")
      ? "production"
      : "sandbox";

    const { createOrder } = ApiClient(UTRUST_API_KEY, UTRUST_ENVIRONMENT);

    switch (event.httpMethod) {
      case "OPTIONS":
        return ALLOWED_METHODS(["POST"]);

      case "POST": {
        if (!event.body) return BAD_REQUEST();

        const input = JSON.parse(event.body);
        if (!isApiUtrustOrderRequestData(input)) return BAD_REQUEST();

        const { accountId, country, email, numMonths } = input;

        const numDecimals = 2;
        const totalNum = totalPurchase(numMonths);
        const totalStr = totalNum.toFixed(numDecimals);
        const plan: SubscriptionPlan = "basic";

        const paymentProvider: PaymentProvider = "utrust";

        const subscription = await readSubscription({ accountId });
        const startDay =
          isSubscription(subscription) &&
          subscriptionStatus({ end: subscription.end }) === "active"
            ? dateToDay(getDate(dayToDate(subscription.end)).plus(1).days())
            : today();

        const purchaseKey =
          numMonths >= maxNumMonths - 1
            ? await createYearlySubscriptionPurchase({
                accountId,
                plan,
                paymentProvider,
                startDay,
              })
            : await createMonthlySubscriptionPurchase({
                accountId,
                plan,
                paymentProvider,
                numMonths,
                startDay,
              });

        // Save reference as stringified purchaseKey.
        const reference = itemKeyToDirname.subscriptionPurchase(purchaseKey);

        const order: Order = {
          reference,
          amount: {
            total: totalStr,
            currency: monthlyPriceCurrency,
          },
          return_urls: {
            callback_url: callbackUrl.toString(),
            return_url: returnUrl.toString(),
            cancel_url: cancelUrl.toString(),
          },
          line_items: [
            {
              sku: plan,
              // TODO translate this, needs lang param
              name: `Subscription (${
                numMonths >= maxNumMonths - 1 ? "1 year" : `${numMonths} months`
              })`,
              price: totalStr,
              currency: monthlyPriceCurrency,
              quantity: 1,
            },
          ],
        };

        const customer: Customer = {
          email,
          country,
        };

        const { data } = await createOrder(order, customer);

        if (data === null) return BAD_REQUEST();

        const { redirectUrl, uuid } = data;

        updateSubscriptionPurchaseInfo({ ...purchaseKey, info: { uuid } });

        const output: ApiUtrustOrderResponseData = { redirectUrl };
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
