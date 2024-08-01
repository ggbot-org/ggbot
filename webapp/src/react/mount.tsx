import { ReactNode } from "react"
// eslint-disable-next-line import/no-internal-modules
import { createRoot } from "react-dom/client"

import { reactRootId } from "./root"

export function mount(Page: ReactNode) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	createRoot(document.getElementById(reactRootId)!).render(
		// Avoid using <StrictMode>
		// it will trigger all `useEffect` twice, so all network requests will run twice.
		// it is better to develop with same conditions the "user" has in production.
		Page
	)
}
