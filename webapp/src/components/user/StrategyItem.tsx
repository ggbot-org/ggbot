import { classnames } from "_/classnames"
import { SchedulingsStatusBadges } from "_/components/user/SchedulingsStatusBadges"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { AccountStrategy } from "@workspace/models"

type Props = AccountStrategy

export function StrategyItem({ name, schedulings, ...strategyKey }: Props) {
	return (
		<div
			className={classnames("box", "strategy-item")}
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
