import { classnames } from "_/classnames"
import { SchedulingsStatusBadges, SchedulingsStatusBadgesProps } from "_/components/user/SchedulingsStatusBadges"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { AccountStrategy } from "@workspace/models"

export function StrategyItem({
	isLoading, name, schedulings, ...strategyKey
}: Omit<AccountStrategy, "schedulings"> &
	SchedulingsStatusBadgesProps &
	Partial<{ isLoading: boolean }>) {
	return (
		<div
			className={classnames("box", "strategy-item", { "skeleton-block": isLoading })}
			onClick={() => GOTO(new URL(webapp.user.strategy(strategyKey)))}
			tabIndex={0}
		>
			<div className={classnames("is-flex", "is-justify-content-space-between")} >
				<span className={classnames("is-unselectable")}>{name}</span>
				<SchedulingsStatusBadges schedulings={schedulings} />
			</div>
		</div>
	)
}
