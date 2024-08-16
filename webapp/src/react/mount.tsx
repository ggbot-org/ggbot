import { ReactNode, StrictMode } from "react"
// eslint-disable-next-line import/no-internal-modules
import { createRoot } from "react-dom/client"

import { reactRootId } from "./root"

export function mount(page: ReactNode) {
	createRoot(document.getElementById(reactRootId) as HTMLElement).render(
		<StrictMode>
			{page}
		</StrictMode>
	)
}
