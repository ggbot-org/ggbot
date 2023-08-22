import { Section } from "@ggbot2/design"
import { FC } from "react"

import { PurchaseCanceled } from "../../components/user/PurchaseCanceled.js"
import { PageContainer } from "./PageContainer.js"

export const PurchaseCanceledPage: FC = () => (
	<PageContainer>
		<Section>
			<PurchaseCanceled />
		</Section>
	</PageContainer>
)
