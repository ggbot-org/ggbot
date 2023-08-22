// TODO use translations for this page, then remove this eslint-disable comment
/* eslint-disable react/jsx-newline */
import { mount } from "@ggbot2/react"
import { FC } from "react"

import { Navigation } from "../components/Navigation.js"

const Page: FC = () => (
	<div>
		<Navigation />

		<main>
			<h1>Terms of Service</h1>
		</main>
	</div>
)

mount(Page)
