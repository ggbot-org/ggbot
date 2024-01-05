import { Button } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { ToastContext } from "_/contexts/Toast"
import { logging } from "_/logging"
import { webapp } from "_/routing/webapp"
import { FC, useCallback, useContext, useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

const { warn } = logging("ShareStrategy")

export const ShareStrategy: FC = () => {
	const { formatMessage } = useIntl()
	const { toast } = useContext(ToastContext)
	const { strategyKey, strategyName } = useContext(StrategyContext)

	const shareData = useMemo<
		Pick<ShareData, "title" | "text" | "url"> | undefined
	>(() => {
		if (!strategyKey) return
		return {
			title: "ggbot",
			url: webapp.strategy(strategyKey).href,
			text: strategyName
		}
	}, [strategyKey, strategyName])

	const onClick = useCallback(() => {
		try {
			if (!shareData) return
			if (
				"share" in navigator &&
				"canShare" in navigator &&
				navigator.canShare(shareData)
			) {
				navigator.share(shareData).catch(warn)
			} else if ("clipboard" in navigator && shareData.url) {
				navigator.clipboard
					.writeText(shareData.url)
					.then(() => {
						toast.info(
							formatMessage({ id: "ShareStrategy.copied" })
						)
					})
					.catch(warn)
			} else {
				toast.warning(formatMessage({ id: "ShareStrategy.error" }))
			}
		} catch (error) {
			warn(error)
			toast.warning(formatMessage({ id: "ShareStrategy.error" }))
		}
	}, [shareData, toast, formatMessage])

	return (
		<Button isOutlined color="primary" onClick={onClick}>
			<FormattedMessage id="ShareStrategy.label" />
		</Button>
	)
}
