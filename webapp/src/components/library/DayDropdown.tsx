import { dayFormat } from "_/i18n/formats"
import { ReactNode, useCallback } from "react"
import { FormattedDate } from "react-intl"
import { Control, Dropdown, DropdownMenu, DropdownProps, DropdownTrigger, Field } from "trunx"

import { Calendar, CalendarProps } from "./Calendar"
import { Label } from "./Label"

export type DayDropdownProps = Partial<{ disabled: boolean }> &
	Required<Pick<DropdownProps, "isActive" | "onClick">> &
	Pick<DropdownProps, "isRight"> &
	Pick<CalendarProps, "day" | "setDay" | "min" | "max"> & {
		label: ReactNode
	} & { close: () => void }

export function DayDropdown({ close, day, disabled, isActive, isRight, label, max, min, onClick, setDay }: DayDropdownProps) {
	return (
		<Field>
			<Label>{label}</Label>
			<Control>
				<Dropdown
					isActive={disabled ? undefined : isActive}
					isRight={isRight}
					onClick={disabled ? undefined : onClick}
				>
					<DropdownTrigger disabled={disabled}>
						<FormattedDate value={day} {...dayFormat} />
					</DropdownTrigger>
					<DropdownMenu>
						<Calendar
							day={day}
							max={max}
							min={min}
							setDay={useCallback<DayDropdownProps["setDay"]>(
								(day) => {
									setDay(day)
									close()
								},
								[close, setDay]
							)}
						/>
					</DropdownMenu>
				</Dropdown>
			</Control>
		</Field>
	)
}
