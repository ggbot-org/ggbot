import { Strategy } from "@workspace/models"

const itemKeys = [
	"activeTabId",
	"authToken",
	"doNotShowPleasePurchase",
	"gotFirstPageView",
	"hideInactiveStrategies",
	"strategy",
	"DEBUG_backtesting"
] as const

type ItemKey = (typeof itemKeys)[number]

/**
 * Get item keys used by session and local storage.
 *
 * @remarks
 * Every item key includes a version. Every version can be updated
 * independently: it should be done when type of value changes.
 *
 * Notice that `DEBUG_*` are used internally and do not have a version.
 */
export const itemKey: Record<ItemKey, (...args: any[]) => string> = {
	activeTabId: (pageName: string) => `${pageName}:activeTab:v2`,
	authToken: () => "authToken:v1",
	doNotShowPleasePurchase: () => "doNotShowPleasePurchase:v1",
	gotFirstPageView: () => "gotFirstPageView:v1",
	hideInactiveStrategies: () => "hideInactiveStrategies:v1",
	strategy: (id: Strategy["id"]) => `strategy:${id}:v1`,
	// Debug keys.
	DEBUG_backtesting: () => "DEBUG_backtesting"
}
