import { classNames } from "_/classNames"
import {
	BrandName,
	Button,
	Flex,
	Hero,
	Level,
	LevelItem,
	Logo
} from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { useGotFirstPageView } from "_/hooks/useGotFirstPageView"
import { webapp } from "_/routing/webapp"
import { FC, useCallback } from "react"
import { FormattedMessage } from "react-intl"

export const HomePage: FC = () => {
	const { gotFirstPageView } = useGotFirstPageView()

	const onClickCallToAction = useCallback(() => {
		location.assign(webapp.user.dashboard.href)
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
			</Hero>
		</PageContainer>
	)
}
