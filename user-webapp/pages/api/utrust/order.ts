import { readSession } from "@ggbot2/cookies";
import {
  itemKeyToDirname,
  readSubscription,
  createYearlySubscriptionPurchase,
  createMonthlySubscriptionPurchase,
  updateSubscriptionPurchaseInfo,
} from "@ggbot2/database";
import { getUtrustApiKey, getUtrustEnvironment } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
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
} from "@ggbot2/models";
import { today, getDate, dayToDate, dateToDay } from "@ggbot2/time";
import {
  NaturalNumber,
  isNaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import { ApiClient, Order, Customer } from "@utrustdev/utrust-ts-library";
import { NextApiRequest, NextApiResponse } from "next";
import { pathname, webappBaseUrl } from "_routing";

type RequestData = {
  country: AllowedCountryIsoCode2;
  email: EmailAddress;
  numMonths: NaturalNumber;
};

type ResponseData = {
  redirectUrl?: string;
};

const isRequestData = objectTypeGuard<RequestData>(
  ({ country, email, numMonths }) =>
    isAllowedCountryIsoCode2(country) &&
    isEmailAddress(email) &&
    isNaturalNumber(numMonths)
);

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Handle HTTP method
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});
    const { accountId } = session;

    const utrustEnvironment = getUtrustEnvironment();

    const apiKey = getUtrustApiKey();
    const { createOrder } = ApiClient(apiKey, utrustEnvironment);

    // Check ResponseData is valid
    const input = req.body;
    if (!isRequestData(input)) return res.status(__400__BAD_REQUEST__).json({});

    const { country, email, numMonths } = input;

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
        // TODO try to get host from headers or origin from request url.
        callback_url: `${webappBaseUrl}${pathname.apiUtrustCallback()}`,
        return_url: `${webappBaseUrl}${pathname.subscriptionPurchasedPage()}`,
        cancel_url: `${webappBaseUrl}${pathname.subscriptionCanceledPage()}`,
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

    if (data === null) return res.status(__400__BAD_REQUEST__).json({});

    const { redirectUrl, uuid } = data;

    updateSubscriptionPurchaseInfo({ ...purchaseKey, info: { uuid } });

    res.status(__200__OK__).json({ redirectUrl });
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
