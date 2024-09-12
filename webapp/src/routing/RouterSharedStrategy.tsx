import { I18nProvider } from "_/contexts/I18n"
import { IntlProvider } from "_/contexts/Intl"
import { ToastProvider } from "_/contexts/Toast"
import { SharedStrategyPage } from "_/pages/public/SharedStrategy"
import { mount } from "_/react/mount"

mount(
	<I18nProvider>
		<IntlProvider>
			<ToastProvider>
				<SharedStrategyPage />
			</ToastProvider>
		</IntlProvider>
	</I18nProvider>
)
