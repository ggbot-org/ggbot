import { Day } from "@ggbot2/time";
import { FC, useId } from "react";
import {
  Control,
  Dropdown,
  DropdownMenu,
  DropdownProps,
  DropdownTrigger,
  Field,
  Label,
} from "trunx";

import { useFormattedDate } from "../hooks/useFormattedDate.js";
import { _classNames } from "./_classNames.js";
import { Calendar } from "./Calendar.js";

export type DayDropdownProps = Required<
  Pick<DropdownProps, "isActive" | "onClick">
> & {
  day: Day;
  label: string;
  setDay: (arg: Day) => void;
};

export const DayDropdown: FC<DayDropdownProps> = ({
  day,
  label,
  isActive,
  onClick,
}) => {
  const id = useId();
  const formattedDay = useFormattedDate(day, "day");

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>

      <Control>
        <Dropdown isActive={isActive} onClick={onClick}>
          <DropdownTrigger>{formattedDay}</DropdownTrigger>

          <DropdownMenu>
            <Calendar />
          </DropdownMenu>
        </Dropdown>
      </Control>
    </Field>
  );
};
