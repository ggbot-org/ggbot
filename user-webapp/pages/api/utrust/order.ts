import { readEmailCookie } from "@ggbot2/cookies";
import { getUtrustApiKey, deployStageIsMain } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { readSubscription } from "@ggbot2/database";
import {
  AllowedCountryIsoCode2,
  EmailAddress,
  PaymentProvider,
  SubscriptionPlan,
  isAllowedCountryIsoCode2,
  isEmailAddress,
  monthlyPriceCurrency,
  newMonthlySubscription,
  newYearlySubscription,
  purchaseMaxNumMonths as maxNumMonths,
  totalPurchase,
} from "@ggbot2/models";
import { today, getDate, dayToDate, dateToDay } from "@ggbot2/time";
import {
  NaturalNumber,
  isNaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import { ApiClient, Order, Customer } from "@utrustdev/utrust-ts-library";
import type { NextApiRequest, NextApiResponse } from "next";
import { readSession, route, webappBaseUrl } from "_routing";

type RequestData = {
  country: AllowedCountryIsoCode2;
  email: EmailAddress;
  numMonths: NaturalNumber;
};

const isRequestData = objectTypeGuard<RequestData>(
  ({ country, email, numMonths }) =>
    isAllowedCountryIsoCode2(country) &&
    isEmailAddress(email) &&
    isNaturalNumber(numMonths)
);

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Handle HTTP method
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});
    const { accountId } = session;

    const apiKey = getUtrustApiKey();
    const { createOrder } = ApiClient(
      apiKey,
      deployStageIsMain ? "production" : "sandbox"
    );

    // Check ResponseData is valid
    const input = req.body;
    if (!isRequestData(input)) return res.status(__400__BAD_REQUEST__).json({});

    const { country, email, numMonths } = input;

    const returnUrl = `${webappBaseUrl}${route.settingsPage("billing")}`;

    const numDecimals = 2;
    const totalNum = totalPurchase(numMonths);
    const totalStr = totalNum.toFixed(numDecimals);
    const plan: SubscriptionPlan = "basic";
    const reference = `order-${plan}`;

    const paymentProvider: PaymentProvider = "utrust";

    const subscription = await readSubscription({ accountId });
    const startDay = subscription
      ? dateToDay(getDate(dayToDate(subscription.end)).plus(1).days())
      : today();

    const purchase =
      numMonths >= maxNumMonths - 1
        ? newYearlySubscription({ plan, paymentProvider, startDay })
        : newMonthlySubscription({
            plan,
            paymentProvider,
            numMonths,
            startDay,
          });

    console.log(purchase);
    // TODO store purchase
    // use CreateYearlySubscriptionPurchase and
    // CreateMonthlySubscriptionPurchase

    const order: Order = {
      reference,
      amount: {
        total: totalStr,
        currency: monthlyPriceCurrency,
      },
      return_urls: {
        return_url: returnUrl,
      },
      line_items: [
        {
          sku: purchase.id,
          name: "Subscription",
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

    const order2 = await createOrder(order, customer);
    console.log(order2);
    const { data } = order2;
    console.log("order", data);

    if (data === null) return res.status(__400__BAD_REQUEST__).json({});

    const { redirectUrl } = data;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
