import { classnames } from "_/classnames"
import {
	BrandName,
	Button,
	Hero,
	HeroBody,
	HeroFoot,
	Level,
	LevelItem,
	Logo
} from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { useGotFirstPageView } from "_/hooks/useGotFirstPageView"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

export function HomePage() {
	const { gotFirstPageView } = useGotFirstPageView()
	const [ctaIsActive, setCtaIsActive] = useState(false)

	return (
		<PageContainer>
			<Hero className={classnames("is-black")}>
				<HeroBody>
					<Level>
						<LevelItem>
							<Logo animated={!gotFirstPageView} size={200} />
						</LevelItem>

						<LevelItem>
							<div
								className={classnames(
									"is-flex",
									"is-flex-direction-column"
								)}
							>
								<BrandName size="large" />

								<i>
									<FormattedMessage id="HomePage.tagline" />
								</i>
							</div>
						</LevelItem>
					</Level>
				</HeroBody>

				<HeroFoot>
					<div
						className={classnames(
							"is-flex",
							"is-justify-content-center",
							"is-align-content-center",
							"mb-6"
						)}
					>
						<Button
							isOutlined={!ctaIsActive}
							onClick={() => {
								GOTO(webapp.user.dashboard)
							}}
							onFocus={() => setCtaIsActive(true)}
							onBlur={() => setCtaIsActive(false)}
							onPointerEnter={() => setCtaIsActive(true)}
							onPointerLeave={() => setCtaIsActive(false)}
							size="large"
							color="primary"
						>
							<FormattedMessage id="HomePage.callToAction" />
						</Button>
					</div>
				</HeroFoot>
			</Hero>
		</PageContainer>
	)
}
