import { Column, Columns, Logo, Section, Title } from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { FC } from "react"

import { ButtonColors, LoadingButtons } from "./examples/Buttons"
import { SimpleForm } from "./examples/Forms"
import { Icons } from "./examples/Icons"
import { InputFields } from "./examples/InputFields"
import { Palette } from "./examples/Palette"
import { SimpleTable } from "./examples/Tables"
import { Tags } from "./examples/Tags"
import { TimeIntervalSelectors } from "./examples/TimeIntervalSelectors"
import { ToastExample } from "./examples/Toast"
import { Typography } from "./examples/Typography"

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
