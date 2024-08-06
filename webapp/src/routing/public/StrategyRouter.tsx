import { I18nProvider } from "_/contexts/I18n"
import { StrategyPage } from "_/pages/Strategy"
import { mount } from "_/react/mount"

mount(
	<I18nProvider>
		<StrategyPage />
	</I18nProvider>
)
