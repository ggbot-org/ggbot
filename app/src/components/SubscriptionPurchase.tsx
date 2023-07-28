import {
  Box,
  Button,
  Checkmark,
  Column,
  Columns,
  Control,
  Field,
  Flex,
  InputOnChange,
  Message,
  SelectOnChange,
  SelectProps,
  Title,
} from "@ggbot2/design";
import {
  AllowedCountryIsoCode2,
  isAllowedCountryIsoCode2,
  monthlyPrice,
  monthlyPriceCurrency,
  purchaseMaxNumMonths as maxNumMonths,
  totalPurchase,
} from "@ggbot2/models";
import { getTime, now } from "@ggbot2/time";
import { isMaybeObject, isNaturalNumber } from "@ggbot2/type-utils";
import { countries } from "country-isocode2/en";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Email } from "../components/Email.js";
import {
  SubscriptionEnd,
  SubscriptionEndProps,
} from "../components/SubscriptionEnd.js";
import { SubscriptionNumMonths } from "../components/SubscriptionNumMonths.js";
import { SubscriptionTotalPrice } from "../components/SubscriptionTotalPrice.js";
import { AccountContext } from "../contexts/Account.js";
import { SubscriptionContext } from "../contexts/Subscription.js";
import { useApi } from "../hooks/useApi.js";
import { url } from "../routing/URLs.js";
import { SelectCountry } from "./SelectCountry.js";

const fields = ["country"] as const;
const fieldName = {
  country: "country",
} as const satisfies Record<string, (typeof fields)[number]>;

// TODO i18n for country names, and label "-- your country --"
// do not import country names from "country-isocode2/en",
// create a map with allowed countries.
const allowedCountryOptions = Object.entries(countries)
  .filter(([isoCode2]) => isAllowedCountryIsoCode2(isoCode2))
  .map(([isoCode2, country]) => ({
    value: isoCode2,
    label: country,
  }));

const minNumMonths = 1;
const defaultNumMonths = 6;

export const SubscriptionPurchase: FC = () => {
  const { account } = useContext(AccountContext);
  const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } =
    useContext(SubscriptionContext);

  const SET_COUNTRY = useApi.SetAccountCountry();

  const [purchaseIsPending, setPurchaseIsPending] = useState(false);
  const [formattedMonthlyPrice, setFormattedMonthlyPrice] = useState("");
  const [formattedTotalPrice, setFormattedTotalPrice] = useState("");
  const [country, setCountry] = useState<AllowedCountryIsoCode2 | "">("");
  const [numMonths, setNumMonths] = useState<number | undefined>(
    defaultNumMonths
  );

  {
    /* TODO move it SelectCountry component */
  }
  const countryOptions: SelectProps["options"] = allowedCountryOptions;

  let purchaseIsDisabled = false;
  if (!country) purchaseIsDisabled = true;
  if (isNaturalNumber(numMonths)) {
    if (numMonths < minNumMonths) purchaseIsDisabled = true;
    if (numMonths > maxNumMonths) purchaseIsDisabled = true;
  }

  let newSubscriptionEnd: SubscriptionEndProps["value"];
  if (isNaturalNumber(numMonths)) {
    const start = subscriptionEnd
      ? getTime(subscriptionEnd).plus(1).days()
      : now();
    newSubscriptionEnd = getTime(start)
      .plus(numMonths >= maxNumMonths - 1 ? maxNumMonths : numMonths)
      .months();
  }

  const isYearlyPurchase: boolean | undefined =
    typeof numMonths === "number" && numMonths >= maxNumMonths - 1
      ? true
      : undefined;

  const onChangeNumMonths = useCallback<InputOnChange>(
    (event) => {
      const value = event.target.value;
      if (value === "") {
        setNumMonths(undefined);
        return;
      }
      const num = Number(value);
      if (num >= minNumMonths && num <= maxNumMonths) setNumMonths(num);
    },
    [setNumMonths]
  );

  const onChangeCountry = useCallback<SelectOnChange>(
    (event) => {
      const country = event.target.value;
      if (isAllowedCountryIsoCode2(country)) setCountry(country);
    },
    [setCountry]
  );

  const onClickPurchase = useCallback(async () => {
    if (purchaseIsDisabled) return;
    if (purchaseIsPending) return;
    setPurchaseIsPending(true);
    try {
      const response = await fetch(url.apiPurchaseOrder, {
        // TODO define fields (and type-guard) in api package, use them also in utrust lambda
        body: JSON.stringify({
          accountId: account.id,
          country,
          email: account.email,
          numMonths,
        }),
        credentials: "omit",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        if (isMaybeObject<{ redirectUrl: string }>(data)) {
          const { redirectUrl } = data;
          if (typeof redirectUrl === "string")
            window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error(error);
      setPurchaseIsPending(false);
    }
  }, [account, country, numMonths, purchaseIsDisabled, purchaseIsPending]);

  useEffect(() => {
    if (account.country) setCountry(account.country);
  }, [account, setCountry]);

  useEffect(() => {
    if (!country) return;
    if (account.country === country) return;

    if (SET_COUNTRY.canRun) SET_COUNTRY.request({ country });
  }, [SET_COUNTRY, account, country]);

  useEffect(() => {
    const { format } = new Intl.NumberFormat(window.navigator.language, {
      style: "currency",
      currency: monthlyPriceCurrency,
    });
    if (!formattedMonthlyPrice) setFormattedMonthlyPrice(format(monthlyPrice));
    if (numMonths) setFormattedTotalPrice(format(totalPurchase(numMonths)));
  }, [formattedMonthlyPrice, numMonths]);

  if (!canPurchaseSubscription) return null;

  return (
    <Box>
      <Title>
        <FormattedMessage id="SubscriptionPurchase.title" />
      </Title>

      {hasActiveSubscription ? (
        <Message color="danger">
          <FormattedMessage id="SubscriptionPurchase.couldRenew" />
        </Message>
      ) : null}

      <Message>
        <p>Price for 1 month is {formattedMonthlyPrice}.</p>

        <Flex>
          <span>
            Go for 12 months subscription and get 1 month for <em>free</em>.
          </span>

          <Checkmark ok={isYearlyPurchase || undefined} />
        </Flex>
      </Message>

      <Columns>
        <Column isNarrow>
          <SubscriptionNumMonths
            value={numMonths}
            onChange={onChangeNumMonths}
          />
        </Column>

        <Column>
          <SubscriptionEnd value={newSubscriptionEnd} />
        </Column>
      </Columns>

      <SelectCountry
        name={fieldName.country}
        onChange={onChangeCountry}
        options={countryOptions}
        value={country}
      />

      <Email readOnly value={account.email} />

      <SubscriptionTotalPrice
        value={formattedTotalPrice}
        isYearlyPurchase={isYearlyPurchase === true}
      />

      <Field>
        <Control>
          <Button
            color="primary"
            disabled={purchaseIsDisabled}
            onClick={onClickPurchase}
            isLoading={purchaseIsPending}
          >
            <FormattedMessage id="SubscriptionPurchase.button" />
          </Button>
        </Control>
      </Field>
    </Box>
  );
};
