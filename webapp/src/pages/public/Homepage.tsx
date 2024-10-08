import { classnames } from "_/classnames"
import { BrandName, Button, Div, Hero, HeroBody, HeroFoot, Level, LevelItem, Logo, Page } from "_/components/library"
import { Footer } from "_/components/public/Footer"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { sessionWebStorage } from "_/storages/session"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

import { BrandTagline } from "../../components/library"

export function Homepage() {
	const [ctaIsActive, setCtaIsActive] = useState(false)

	const gotFirstPageView = sessionWebStorage.gotFirstPageView.get()
	useEffect(() => {
		if (!gotFirstPageView) sessionWebStorage.gotFirstPageView.set(true)
	}, [gotFirstPageView])

	return (
		<Page
			footer={<Footer />}
			header={
				<Hero bulma="is-black">
					<HeroBody className={classnames("homepage-hero-content")}>
						<Level>
							<LevelItem>
								<Logo animated={!gotFirstPageView} size={200} />
							</LevelItem>
							<LevelItem>
								<Div
									bulma={["is-flex", "is-flex-direction-column"]}
								>
									<BrandName size="large" />
									<BrandTagline animated={!gotFirstPageView} />
								</Div>
							</LevelItem>
						</Level>
					</HeroBody>
					<HeroFoot className={classnames("homepage-hero-content")}>
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
								onClick={() => GOTO(webapp.user.dashboard)}
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
			}
		>
			{null}
		</Page>
	)
}
