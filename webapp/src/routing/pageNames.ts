// For now this is not a full list of all pageNames, but only those used as tabs.
const pageNames = [
	"AdminAccountDetails",
	"AdminDashboard",
	"Dashboard",
	"Strategy"
] as const
export type PageName = (typeof pageNames)[number]
