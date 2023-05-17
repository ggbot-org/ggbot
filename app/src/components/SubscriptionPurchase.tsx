import { SubscriptionContext } from "_contexts/Subscription";
import { useApi } from "_hooks/useApi";
import { useApiBaseURL } from "_hooks/useApiBaseUrl";
import { buttonLabel, fieldLabel, title } from "_i18n";
import {
  Box,
  Button,
  Checkmark,
  Column,
  Columns,
  Control,
  Field,
  Flex,
  InputField,
  InputOnChange,
  Message,
  OutputField,
  SelectField,
  SelectOnChange,
  SelectProps,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import { ApiPurchaseOrderURL } from "@ggbot2/locators";
import {
  AllowedCountryIsoCode2,
  isAccount,
  isAllowedCountryIsoCode2,
  monthlyPrice,
  monthlyPriceCurrency,
  purchaseMaxNumMonths as maxNumMonths,
  totalPurchase,
} from "@ggbot2/models";
import { getTime, now, Time } from "@ggbot2/time";
import { isMaybeObject, isNaturalNumber } from "@ggbot2/type-utils";
import { countries } from "country-isocode2/en";
import { FC, useCallback, useContext, useEffect, useState } from "react";

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
  const apiBaseURL = useApiBaseURL();

  const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } =
    useContext(SubscriptionContext);

  const [READ_ACCOUNT, { data: account }] = useApi.ReadAccount();
  const [SET_COUNTRY] = useApi.SetAccountCountry();

  const [purchaseIsPending, setPurchaseIsPending] = useState(false);
  const [formattedMonthlyPrice, setFormattedMonthlyPrice] = useState("");
  const [formattedTotalPrice, setFormattedTotalPrice] = useState("");
  const [country, setCountry] = useState<AllowedCountryIsoCode2 | "">("");
  const [numMonths, setNumMonths] = useState<number | undefined>(
    defaultNumMonths
  );

  let countryOptions: SelectProps["options"] = [{ value: "", label: "" }];
  let email = "";
  let selectCountryIsDisabled = false;
  if (isAccount(account)) {
    countryOptions = account.country
      ? allowedCountryOptions
      : [{ value: "", label: "-- your country --" }, ...allowedCountryOptions];
    email = account.email;
    selectCountryIsDisabled = false;
  }

  const accountId = isAccount(account) ? account.id : undefined;

  let purchaseIsDisabled = false;
  if (!accountId) purchaseIsDisabled = true;
  if (!country) purchaseIsDisabled = true;
  if (isNaturalNumber(numMonths)) {
    if (numMonths < minNumMonths) purchaseIsDisabled = true;
    if (numMonths > maxNumMonths) purchaseIsDisabled = true;
  }

  let newSubscriptionEnd: Time | undefined;
  if (isNaturalNumber(numMonths)) {
    const start = subscriptionEnd
      ? getTime(subscriptionEnd).plus(1).days()
      : now();
    newSubscriptionEnd = getTime(start)
      .plus(numMonths >= maxNumMonths - 1 ? maxNumMonths : numMonths)
      .months();
  }

  const formattedNewSubscriptionEnd = useFormattedDate(
    newSubscriptionEnd,
    "day"
  );

  const isYearlyPurchase =
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
      if (!apiBaseURL) return;
      const apiPurchaseOrderURL = new ApiPurchaseOrderURL(apiBaseURL);
      const response = await fetch(apiPurchaseOrderURL, {
        // TODO define fields (and type-guard) in api package, use them also in utrust lambda
        body: JSON.stringify({ accountId, country, email, numMonths }),
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
  }, [
    accountId,
    apiBaseURL,
    country,
    email,
    numMonths,
    purchaseIsDisabled,
    purchaseIsPending,
  ]);

  useEffect(() => {
    if (!isAccount(account)) return;
    if (account.country) setCountry(account.country);
  }, [account, setCountry]);

  useEffect(() => {
    if (!isAccount(account)) return;
    if (!country) return;
    if (account.country !== country) {
      SET_COUNTRY({ country });
    }
  }, [account, country, SET_COUNTRY]);

  useEffect(() => {
    const controller = READ_ACCOUNT({});
    return () => controller.abort();
  }, [READ_ACCOUNT]);

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
      <Title>{title.purchase}</Title>

      {hasActiveSubscription ? (
        <Message color="danger">
          Your subscription will expire soon, please consider renew it.
        </Message>
      ) : null}

      <Message>
        <p>Price for 1 month is {formattedMonthlyPrice}.</p>

        <Flex>
          <span>
            Go for 12 months subscription and get 1 month for <em>free</em>.
          </span>

          <Checkmark ok={isYearlyPurchase} />
        </Flex>
      </Message>

      <Columns>
        <Column isNarrow>
          <InputField
            label={fieldLabel.numMonths}
            value={numMonths}
            type="number"
            onChange={onChangeNumMonths}
            min={1}
            max={12}
            step={1}
          />
        </Column>

        <Column>
          <OutputField
            label={fieldLabel.endDay}
            value={formattedNewSubscriptionEnd}
          />
        </Column>
      </Columns>

      <SelectField
        disabled={selectCountryIsDisabled}
        label={fieldLabel.country}
        name={fieldName.country}
        onChange={onChangeCountry}
        options={countryOptions}
        value={country}
      />

      <OutputField label={fieldLabel.email} value={email} />

      <OutputField
        label={fieldLabel.totalPrice}
        value={formattedTotalPrice}
        color={isYearlyPurchase ? "success" : undefined}
        help={isYearlyPurchase ? <p>One month for free.</p> : <>&nbsp;</>}
      />

      <Field>
        <Control>
          <Button
            color="primary"
            disabled={purchaseIsDisabled}
            onClick={onClickPurchase}
            isLoading={purchaseIsPending}
          >
            {buttonLabel.purchase}
          </Button>
        </Control>
      </Field>
    </Box>
  );
};
