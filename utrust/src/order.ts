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
} from "@ggbot2/http-status-codes";
import { apiDomain, userWebappDomain, pathname } from "@ggbot2/locators";
import {
  AllowedCountryIsoCode2,
  EmailAddress,
  PaymentProvider,
  SubscriptionPlan,
  isAllowedCountryIsoCode2,
  isEmailAddress,
  monthlyPriceCurrency,
  purchaseMaxNumMonths as maxNumMonths,
  totalPurchase,
  isSubscription,
  subscriptionStatus,
  AccountKey,
  isAccountKey,
} from "@ggbot2/models";
import { today, getDate, dayToDate, dateToDay } from "@ggbot2/time";
import {
  NaturalNumber,
  isNaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import { ApiClient, Order, Customer } from "@utrustdev/utrust-ts-library";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const { UTRUST_API_KEY } = ENV;

// UTRUST_API_KEY starts with
// - u_test_api_ on sandbox environment
// - u_live_api_ on production environment
const UTRUST_ENVIRONMENT = UTRUST_API_KEY.startsWith("u_live")
  ? "production"
  : "sandbox";
const { createOrder } = ApiClient(UTRUST_API_KEY, UTRUST_ENVIRONMENT);

const apiBaseUrl = `https://${apiDomain}`;
const userWebappBaseUrl = `https://${userWebappDomain}`;
const callbackUrl = new URL(pathname.utrustCallback(), apiBaseUrl).toString();
const returnUrl = new URL(
  pathname.subscriptionPurchasedPage(),
  userWebappBaseUrl
).toString();
const cancelUrl = new URL(
  pathname.subscriptionCanceledPage(),
  userWebappBaseUrl
).toString();

const BAD_REQUEST = {
  statusCode: __400__BAD_REQUEST__,
  body: JSON.stringify({ ok: false }),
};

type RequestData = AccountKey & {
  country: AllowedCountryIsoCode2;
  email: EmailAddress;
  numMonths: NaturalNumber;
};

const isRequestData = objectTypeGuard<RequestData>(
  ({ country, email, numMonths, ...accountKey }) =>
    isAllowedCountryIsoCode2(country) &&
    isEmailAddress(email) &&
    isNaturalNumber(numMonths) &&
    isAccountKey(accountKey)
);

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "POST": {
      if (!event.body) return BAD_REQUEST;

      const input = JSON.parse(event.body);
      if (!isRequestData(input)) return BAD_REQUEST;

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
          callback_url: callbackUrl,
          return_url: returnUrl,
          cancel_url: cancelUrl,
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
        statusCode: __200__OK__,
        body: JSON.stringify({ redirectUrl }),
      };
    }

    default: {
      return {
        statusCode: __405__METHOD_NOT_ALLOWED__,
        body: JSON.stringify({}),
      };
    }
  }
};
