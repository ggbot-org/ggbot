import { Classname } from '_/classnames'
import { BrandName, BrandTagline, Button, Div, Hero, HeroBody, HeroFoot, Level, LevelItem, Logo, Page } from '_/components/library'
import { Footer } from '_/components/public/Footer'
import { FormattedMessage } from '_/i18n/components'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { sessionWebStorage } from '_/storages/session'
import { useEffect, useState } from 'react'

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
					<HeroBody className={'homepage-hero-content' satisfies Classname}>
						<Level>
							<LevelItem>
								<Logo animated={!gotFirstPageView} size={200} />
							</LevelItem>
							<LevelItem>
								<Div
									bulma={['is-flex', 'is-flex-direction-column']}
								>
									<BrandName size="large" />
									<BrandTagline animated={!gotFirstPageView} />
								</Div>
							</LevelItem>
						</Level>
					</HeroBody>
					<HeroFoot className={'homepage-hero-content' satisfies Classname}>
						<Div
							bulma={[
								'is-flex',
								'is-justify-content-center',
								'is-align-content-center',
								'mb-6'
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
