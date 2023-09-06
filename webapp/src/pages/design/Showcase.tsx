import { Column, Columns, Logo, Section, Title } from "_/components/library"
import { PageContainer } from "_/components/PageContainer.js"
import { FC } from "react"

import { ButtonColors, LoadingButtons } from "./examples/Buttons.js"
import { SimpleForm } from "./examples/Forms.js"
import { Icons } from "./examples/Icons.js"
import { InputFields } from "./examples/InputFields.js"
import { Palette } from "./examples/Palette.js"
import { SimpleTable } from "./examples/Tables.js"
import { Tags } from "./examples/Tags.js"
import { TimeIntervalSelectors } from "./examples/TimeIntervalSelectors.js"
import { ToastExample } from "./examples/Toast.js"
import { Typography } from "./examples/Typography.js"

export const ShowcasePage: FC = () => (
	<PageContainer>
		<Section>
			<Logo size={71} />
		</Section>

		<Section>
			<Title>Typography</Title>

			<Typography />
		</Section>

		<Section>
			<Title>Palette</Title>

			<Palette />
		</Section>

		<Section>
			<Title>Inputs</Title>

			<Columns>
				<Column size="half">
					<InputFields />
				</Column>
			</Columns>
		</Section>

		<Section>
			<Title>Forms</Title>

			<Columns>
				<Column size="half">
					<SimpleForm />
				</Column>
			</Columns>
		</Section>

		<Section>
			<Title>Buttons</Title>

			<ButtonColors />

			<LoadingButtons />
		</Section>

		<Section>
			<Title>Time interval selectors</Title>

			<TimeIntervalSelectors />
		</Section>

		<Section>
			<Title>Icons</Title>

			<Icons />
		</Section>

		<Section>
			<Title>Tags</Title>

			<Tags />
		</Section>

		<Section>
			<Title>Tables</Title>

			<SimpleTable />
		</Section>

		<Section>
			<Title>Toast</Title>

			<ToastExample />
		</Section>
	</PageContainer>
)
