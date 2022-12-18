import { isSubscription } from "@ggbot2/models";
import { dayToTime } from "@ggbot2/time";
import {
  DateTime,
  OutputField,
  Pill,
  Section,
  SelectField,
  SelectProps,
} from "@ggbot2/ui-components";
import { countries } from "country-isocode2/en";
import { FC, ReactNode, useMemo } from "react";
import { useSubscription } from "_hooks";

export const BillingSettings: FC = () => {
  const { hasActiveSubscription, subscription } = useSubscription();

  const countryOptions = useMemo<SelectProps["options"]>(
    () =>
      Object.entries(countries)
        .filter(([isoCode2]) =>
          ["AT", "FR", "IT", "DE", "ES", "GB", "GR", "NL", "PT"].includes(
            isoCode2
          )
        )
        .map(([isoCode2, country]) => ({
          value: isoCode2,
          label: country,
        })),
    []
  );

  const { subscriptionEnd, subscriptionPlan } = useMemo(
    () =>
      isSubscription(subscription)
        ? {
            subscriptionEnd: dayToTime(subscription.end),
            subscriptionPlan: subscription.plan,
          }
        : {
            subscriptionEnd: undefined,
            subscriptionPlan: "",
          },
    [subscription]
  );

  const subscriptionInfo = useMemo<{ label: string; value: ReactNode }[]>(
    () =>
      [
        {
          label: "plan",
          value: subscriptionPlan,
        },
        {
          label: "end day",
          value: subscriptionEnd && (
            <DateTime format="day" value={subscriptionEnd} />
          ),
        },
      ].map(({ value, ...rest }) => ({
        value: value ? value : <>&nbsp;</>,
        ...rest,
      })),
    [subscriptionEnd, subscriptionPlan]
  );

  return (
    <>
      {hasActiveSubscription && (
        <Section
          header={
            <div className="inline-flex items-center gap-4">
              <span>Subscription</span>
              <div>
                <Pill color="primary">active</Pill>
              </div>
            </div>
          }
        >
          <div>
            {subscriptionInfo.map(({ label, value }, i) => (
              <OutputField key={i} label={label}>
                {value}
              </OutputField>
            ))}
          </div>
        </Section>
      )}

      {hasActiveSubscription === false && (
        <Section header="Subscribe">
          <SelectField
            label="country"
            name="country"
            options={countryOptions}
          />
        </Section>
      )}
    </>
  );
};
