import { isApiUtrustOrderRequestData } from "@ggbot2/api";
import {
  itemKeyToDirname,
  readSubscription,
  createYearlySubscriptionPurchase,
  createMonthlySubscriptionPurchase,
  updateSubscriptionPurchaseInfo,
} from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__
} from "@ggbot2/http-status-codes";
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

// UTRUST_API_KEY starts with
// - u_test_api_ on sandbox environment
// - u_live_api_ on production environment
const UTRUST_ENVIRONMENT = UTRUST_API_KEY.startsWith("u_live")
  ? "production"
  : "sandbox";

const { createOrder } = ApiClient(UTRUST_API_KEY, UTRUST_ENVIRONMENT);

const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);
const apiBaseURL = new ApiBaseURL(DEPLOY_STAGE);
const callbackUrl = new UtrustCallbackURL(apiBaseURL.toString());
const cancelUrl = new UtrustCancelURL(userWebappBaseURL.toString());
const returnUrl = new UtrustReturnURL(userWebappBaseURL.toString());

const accessControlAllowOrigin = {
  "Access-Control-Allow-Origin": userWebappBaseURL.origin,
};

const BAD_REQUEST: APIGatewayProxyResult = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
};

  switch (event.httpMethod) {
    case "OPTIONS": {
      return {
        body: "",
        headers: {
          "Access-Control-Allow-Headers": "Content-type",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          ...accessControlAllowOrigin,
        },
        isBase64Encoded: false,
        statusCode: __200__OK__,
      };
    }

    case "POST": {
      if (!event.body) return BAD_REQUEST;

      const input = JSON.parse(event.body);
      if (!isApiUtrustOrderRequestData(input)) return BAD_REQUEST;

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

      if (data === null) return BAD_REQUEST;

      const { redirectUrl, uuid } = data;

      updateSubscriptionPurchaseInfo({ ...purchaseKey, info: { uuid } });

      return {
        body: JSON.stringify({ redirectUrl }),
        headers: {
          "Content-Type": "application/json",
          ...accessControlAllowOrigin,
        },
        isBase64Encoded: false,
        statusCode: __200__OK__,
      };
    }

    default: {
      return {
        body: "",
        headers: accessControlAllowOrigin,
        isBase64Encoded: false,
        statusCode: __405__METHOD_NOT_ALLOWED__,
      };
    }
  }
  } catch(error) {
    console.error(error);
    return {
      body: "",
      headers: accessControlAllowOrigin,
      isBase64Encoded: false,
      statusCode: __500__INTERNAL_SERVER_ERROR__,
    };
  }
};
