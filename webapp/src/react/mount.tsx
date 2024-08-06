import { ReactNode } from "react"
// eslint-disable-next-line import/no-internal-modules
import { createRoot } from "react-dom/client"

import { reactRootId } from "./root"

export function mount(Page: ReactNode) {
	createRoot(document.getElementById(reactRootId) as HTMLElement).render(
		// Avoid using <StrictMode>
		// it will trigger all `useEffect` twice, so all network requests will run twice.
		// it is better to develop with same conditions the "user" has in production.
		Page
	)
}
