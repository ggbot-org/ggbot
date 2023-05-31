import { Day } from "@ggbot2/time";
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import {
  Control,
  Dropdown,
  DropdownMenu,
  DropdownProps,
  DropdownTrigger,
  Field,
  InputProps,
  Label,
} from "trunx";

import { useFormattedDate } from "../hooks/useFormattedDate.js";
import { _classNames } from "./_classNames.js";
import { Calendar } from "./Calendar.js";

// TODO move it to trunx
type DropdownOnClick = MouseEventHandler<HTMLDivElement>;

type DayDropdownProps = Pick<DropdownProps, "isActive" | "onClick"> & {
  day: Day;
  label: string;
  setDay: (arg: Day) => void;
};

const DayDropdown: FC<DayDropdownProps> = ({
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

export type DailyIntervalClassNames = "DailyInterval";

export type DailyIntervalProps = Pick<InputProps, "min" | "max"> & {
  labelStart: DayDropdownProps["label"];
  labelEnd: DayDropdownProps["label"];
  start: DayDropdownProps["day"];
  end: DayDropdownProps["day"];
  setStart: DayDropdownProps["setDay"];
  setEnd: DayDropdownProps["setDay"];
};

export const DailyInterval: FC<DailyIntervalProps> = ({
  labelStart,
  labelEnd,
  // min,
  // max,
  start,
  end,
  setStart,
  setEnd,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<
    "start" | "end" | undefined
  >();

  const onClickStart = useCallback<DropdownOnClick>((event) => {
    event.stopPropagation();
    setActiveDropdown((activeDropdown) => {
      if (activeDropdown === "start") return undefined;
      return "start";
    });
  }, []);

  const onClickEnd = useCallback<DropdownOnClick>((event) => {
    event.stopPropagation();
    setActiveDropdown((activeDropdown) => {
      if (activeDropdown === "end") return undefined;
      return "end";
    });
  }, []);

  // Close dropdowns on outside click.
  useEffect(() => {
    const closeDropdowns = () => {
      setActiveDropdown(undefined);
    };
    window.addEventListener("click", closeDropdowns);
    return () => {
      window.removeEventListener("click", closeDropdowns);
    };
  }, []);

  // const onChangeStart = useCallback<DaySelectorOnChange>(
  //   (event) => {
  //     const value = event.target.value;
  //     if (!isDay(value)) return;
  //     if (value > end) return;
  //     setStart(value);
  //   },
  //   [end, setStart]
  // );

  // const onChangeEnd = useCallback<DaySelectorOnChange>(
  //   (event) => {
  //     const value = event.target.value;
  //     if (!isDay(value)) return;
  //     if (value < start) return;
  //     setEnd(value);
  //   },
  //   [start, setEnd]
  // );

  return (
    <div className={_classNames("DailyInterval")}>
      <DayDropdown
        isActive={activeDropdown === "start"}
        day={start}
        label={labelStart}
        onClick={onClickStart}
        setDay={setStart}
      />

      <DayDropdown
        isActive={activeDropdown === "end"}
        day={end}
        label={labelEnd}
        onClick={onClickEnd}
        setDay={setEnd}
      />
    </div>
  );
};
