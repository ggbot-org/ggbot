import { Button } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { ToastContext } from "_/contexts/Toast"
import { href } from "_/routing/public/hrefs"
import { FC, useCallback, useContext, useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const ShareStrategy: FC = () => {
	const { formatMessage } = useIntl()
	const { toast } = useContext(ToastContext)
	const { strategy } = useContext(StrategyContext)

	const shareData = useMemo<
		Pick<ShareData, "title" | "text" | "url"> | undefined
	>(
		() => ({
			title: "ggbot2",
			url: `${window.location.origin}${href.strategyPage({
				strategyId: strategy.id,
				strategyKind: strategy.kind
			})}`,
			text: strategy.name
		}),
		[strategy]
	)

	const onClick = useCallback(async () => {
		try {
			if (!shareData) return
			if (
				"share" in navigator &&
				"canShare" in navigator &&
				navigator.canShare(shareData)
			) {
				navigator.share(shareData)
			} else if ("clipboard" in navigator && shareData.url) {
				navigator.clipboard.writeText(shareData.url)
				toast.info(formatMessage({ id: "ShareStrategy.copied" }))
			} else {
				toast.warning(formatMessage({ id: "ShareStrategy.error" }))
			}
		} catch (error) {
			console.error(error)
			toast.warning(formatMessage({ id: "ShareStrategy.error" }))
		}
	}, [shareData, toast, formatMessage])

	return (
		<Button isOutlined color="primary" onClick={onClick}>
			<FormattedMessage id="ShareStrategy.label" />
		</Button>
	)
}
