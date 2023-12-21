import { FC } from "react"
import { createRoot } from "react-dom/client"

import { reactRootId } from "./root"

export const mount = (Page: FC) => {
	const domNode = document.getElementById(reactRootId)
	if (!domNode) return
	const root = createRoot(domNode)
	root.render(
		// Avoid using <StrictMode>
		// it will trigger all `useEffect` twice, so all network requests will run twice.
		// it is better to develop with same conditions the "user" has in production.
		<Page />
	)
}
