import { FC } from "react"
import { createRoot } from "react-dom/client"

import { reactRootId } from "./root.js"

export const mount = (Page: FC) => {
	const domNode = document.getElementById(reactRootId)
	if (!domNode) return
	const root = createRoot(domNode)
	root.render(<Page />)
}
