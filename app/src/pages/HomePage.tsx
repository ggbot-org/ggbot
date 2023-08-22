import { Logo } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import { useGotFirstPageView } from "../hooks/useGotFirstPageView.js"
import { href } from "../routing/public/hrefs.js"
import { PageContainer } from "./PageContainer.js"

export const HomePage: FC = () => {
	const { gotFirstPageView } = useGotFirstPageView()

	return (
		<PageContainer>
			<div>
				<div>
					<Logo animated={!gotFirstPageView} size={400} />

					<div>
						<h1>
							ggbot<b>2</b>
						</h1>

						<i>crypto flow</i>
					</div>
				</div>

				<main>
					<a href={href.userDashboardPage()}>
						<span>
							<FormattedMessage id="HomePage.callToAction" />
						</span>
					</a>
				</main>
			</div>
		</PageContainer>
	)
}
