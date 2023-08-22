import { BrandName, Logo } from "@ggbot2/design"
import { FC, useCallback } from "react"
import { FormattedMessage } from "react-intl"

import {
	Button,
	Column,
	Columns,
	Flex,
	Hero,
	Level,
	LevelItem
} from "../components/library/index.js"
import { useGotFirstPageView } from "../hooks/useGotFirstPageView.js"
import { href } from "../routing/public/hrefs.js"
import { classNames } from "../styles/classNames.js"
import { PageContainer } from "./PageContainer.js"

export const HomePage: FC = () => {
	const { gotFirstPageView } = useGotFirstPageView()

	const onClickCallToAction = useCallback(() => {
		window.location.href = href.userDashboardPage()
	}, [])

	return (
		<PageContainer>
			<Hero
				className={classNames("is-black")}
				foot={
					<Flex
						justify="center"
						alignItems="center"
						spacing={{ mb: 6 }}
					>
						<Button
							isOutlined
							onClick={onClickCallToAction}
							size="large"
							color="primary"
						>
							<FormattedMessage id="HomePage.callToAction" />
						</Button>
					</Flex>
				}
			>
				<Columns>
					<Column size={{ desktop: "half" }}>
						<Level>
							<LevelItem>
								<Logo animated={!gotFirstPageView} size={200} />
							</LevelItem>

							<LevelItem>
								<Flex direction="column">
									<BrandName size="large" />

									<i>
										<FormattedMessage id="HomePage.tagline" />
									</i>
								</Flex>
							</LevelItem>
						</Level>
					</Column>
				</Columns>
			</Hero>
		</PageContainer>
	)
}
