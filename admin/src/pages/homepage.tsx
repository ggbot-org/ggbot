import { mount } from "@ggbot2/react"
import { FC } from "react"

import { Accounts } from "../components/Accounts.js"

export const Page: FC = () => (
	<>
		<h1>ggbot2</h1>

		<Accounts />
	</>
)

mount(Page)
