import { BrandName, Button, Div, Hero, HeroBody, HeroFoot, Level, LevelItem, Logo } from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { sessionWebStorage } from "_/storages/session"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

export function Homepage() {
	const [ctaIsActive, setCtaIsActive] = useState(false)

	const gotFirstPageView = sessionWebStorage.gotFirstPageView.get()
	useEffect(() => {
		if (!gotFirstPageView) sessionWebStorage.gotFirstPageView.set(true)
	}, [gotFirstPageView])

	return (
		<PageContainer>
			<Hero bulma="is-black">
				<HeroBody>
					<Level>
						<LevelItem>
							<Logo animated={!gotFirstPageView} size={200} />
						</LevelItem>

						<LevelItem>
							<Div
								bulma={["is-flex", "is-flex-direction-column"]}
							>
								<BrandName size="large" />

								<i className="is-unselectable">
									<FormattedMessage id="HomePage.tagline" />
								</i>
							</Div>
						</LevelItem>
					</Level>
				</HeroBody>

				<HeroFoot>
					<Div
						bulma={[
							"is-flex",
							"is-justify-content-center",
							"is-align-content-center",
							"mb-6"
						]}
					>
						<Button
							color="primary"
							isOutlined={!ctaIsActive}
							onBlur={() => setCtaIsActive(false)}
							onClick={() => {
								GOTO(webapp.user.dashboard)
							}}
							onFocus={() => setCtaIsActive(true)}
							onPointerEnter={() => setCtaIsActive(true)}
							onPointerLeave={() => setCtaIsActive(false)}
							size="large"
						>
							<FormattedMessage id="HomePage.callToAction" />
						</Button>
					</Div>
				</HeroFoot>
			</Hero>
		</PageContainer>
	)
}
