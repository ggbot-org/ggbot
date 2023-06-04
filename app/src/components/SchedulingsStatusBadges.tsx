import { Control, Field } from "@ggbot2/design";
import { AccountStrategy } from "@ggbot2/models";
import { FC } from "react";

import { SchedulingStatusBadge } from "./SchedulingStatusBadge.js";

type Props = {
  schedulings: AccountStrategy["schedulings"];
};

export const SchedulingsStatusBadges: FC<Props> = ({ schedulings }) => {
  let numActive = 0;
  let numInactive = 0;
  let numSuspended = 0;

  for (const { status } of schedulings) {
    if (status === "active") numActive++;
    if (status === "inactive") numInactive++;
    if (status === "suspended") numSuspended++;
  }

  if (schedulings.length === 0)
    return <SchedulingStatusBadge schedulingStatus="inactive" />;

  if (schedulings.length === 1)
    return <SchedulingStatusBadge schedulingStatus={schedulings[0].status} />;

  return (
    <Field isGrouped="multiline">
      <Control>
        <SchedulingStatusBadge
          schedulingStatus="suspended"
          count={numSuspended}
        />
      </Control>

      <Control>
        <SchedulingStatusBadge
          schedulingStatus="inactive"
          count={numInactive}
        />
      </Control>

      <Control>
        <SchedulingStatusBadge schedulingStatus="active" count={numActive} />
      </Control>
    </Field>
  );
};
