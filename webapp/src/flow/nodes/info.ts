import { FlowViewNode } from 'flow-view'

export class FlowViewNodeInfo extends FlowViewNode {
	static type = 'info'

	static style = {
		textarea: {
			border: '0',
			'font-size': '16px',
			outline: 'none',
			padding: '4px 17px'
		},
		'textarea::selection': { 'background-color': 'transparent' }
	}

	static minNumCols = 5
	static minNumRows = 1

	textarea: HTMLTextAreaElement | undefined

	setNumCols() {
		const { textarea } = this
		if (!textarea) return
		const numCols = textarea.value
			.split('\n')
			.reduce((max, line) => Math.max(max, line.length), 0)
		textarea.cols = Math.max(FlowViewNodeInfo.minNumCols, numCols)
	}

	setNumRows() {
		const { textarea } = this
		if (!textarea) return
		const numRows = textarea.value.split('\n').length
		textarea.rows = Math.max(FlowViewNodeInfo.minNumRows, numRows)
	}

	initContent() {
		// TODO update FlowViewNode definition
		// should be also a generic like createElement<HTMLTextAreaElement>
		// @ts-expect-error
		const textarea = this.createElement('textarea')
		this.textarea = textarea

		textarea.spellcheck = false
		textarea.tabIndex = -1
		textarea.value = this.text
		textarea.wrap = 'off'

		this.setNumRows()
		this.setNumCols()

		textarea.onblur = () => {
			if (this.text !== textarea.value) {
				this.text = textarea.value
				// TODO update FlowViewNode definition
				// @ts-expect-error
				this.view.host.viewChange({ updatedNode: this.toObject() })
			}
			this.view.deselectNode(this)
		}

		textarea.onpointerdown = (event: PointerEvent) => {
			event.stopPropagation()
			this.view.selectNode(this)
		}

		textarea.onpointermove = (event: PointerEvent) => {
			event.stopPropagation()
		}

		textarea.onkeydown = (event: KeyboardEvent) => {
			event.stopPropagation()
			if (event.code === 'Tab') event.preventDefault()
			if (event.code === 'Escape') textarea.blur()
		}

		textarea.onkeyup = (event: KeyboardEvent) => {
			event.stopPropagation()
			this.setNumRows()
			this.setNumCols()
		}
	}
}
