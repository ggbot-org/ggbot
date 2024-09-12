import { I18nProvider } from "_/contexts/I18n"
import { ToastProvider } from "_/contexts/Toast"
import { SharedStrategyPage } from "_/pages/public/SharedStrategy"
import { mount } from "_/react/mount"

mount(
	<I18nProvider>
		<ToastProvider>
			<SharedStrategyPage />
		</ToastProvider>
	</I18nProvider>
)
