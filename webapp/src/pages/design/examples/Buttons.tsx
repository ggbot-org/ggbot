import { Button, Buttons } from '_/components/library'

export function ButtonColors() {
	return (
		<>
			<Buttons>
				<Button>button</Button>
				<Button color="primary">primary</Button>
				<Button color="warning">warning</Button>
				<Button color="danger">danger</Button>
			</Buttons>
			<Buttons>
				<Button disabled>disabled</Button>
				<Button disabled color="primary">
					disabled
				</Button>
				<Button disabled color="warning">
					disabled
				</Button>
				<Button disabled color="danger">
					disabled
				</Button>
			</Buttons>
		</>
	)
}

export function LoadingButtons() {
	return (
		<Buttons>
			<Button isLoading>button</Button>
			<Button isLoading color="primary">
				primary
			</Button>
			<Button isLoading color="warning">
				warning
			</Button>
			<Button isLoading color="danger">
				danger
			</Button>
		</Buttons>
	)
}
