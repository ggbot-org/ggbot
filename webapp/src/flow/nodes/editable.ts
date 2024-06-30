import { FlowViewNode } from "flow-view"

export class FlowViewNodeEditable extends FlowViewNode {
	isEditing: boolean | undefined

	// @ts-expect-error
	init(arg) {
		// @ts-expect-error
		super.init(arg)

		// @ts-expect-error
		this.contentDiv.style.outline = "none"

		// @ts-expect-error
		this._onDblclick = this.onDblclick.bind(this)
		// @ts-expect-error
		this.element.addEventListener("dblclick", this._onDblclick)
	}

	dispose() {
		// @ts-expect-error
		this.element.removeEventListener("dblclick", this._onDblclick)
		this.disposeEditor()
		// @ts-expect-error
		super.dispose()
	}

	disposeEditor() {
		if (!this.isEditing) return

		// @ts-expect-error
		this.contentDiv.removeAttribute("contenteditable")
		// @ts-expect-error
		this.contentDiv.removeEventListener("blur", this._onBlur)
		// @ts-expect-error
		this._onBlur = undefined
		// @ts-expect-error
		this.contentDiv.removeEventListener("keydown", this._onKeydown)
		// @ts-expect-error
		this._onKeydown = undefined

		this.isEditing = false
	}

	onDblclick(event: MouseEvent) {
		event.stopPropagation()
		if (this.isEditing) return

		// @ts-expect-error
		const { contentDiv } = this

		contentDiv.setAttribute("contenteditable", true)
		this.isEditing = true

		// Move cursor to end of text
		const range = document.createRange()
		range.selectNodeContents(contentDiv)
		range.collapse(false)
		const selection = window.getSelection()
		if (!selection) return
		selection.removeAllRanges()
		selection.addRange(range)

		// TODO use handleEvent()
		// TODO remove all ts-ignore

		// @ts-expect-error
		this._onKeydown = this.onKeydown.bind(this)
		// @ts-expect-error
		contentDiv.addEventListener("keydown", this._onKeydown)
		// @ts-expect-error
		this._onBlur = this.onBlur.bind(this)
		// @ts-expect-error
		contentDiv.addEventListener("blur", this._onBlur)

		contentDiv.focus()
	}

	onBlur(event: FocusEvent) {
		event.stopPropagation()
		const {
			// @ts-expect-error
			contentDiv: { textContent },
			text
		} = this
		if (textContent && text !== textContent) {
			this.text = textContent
			// @ts-expect-error
			this.view.host.viewChange({ updatedNode: this.toObject() })
		} else {
			// @ts-expect-error
			this.contentDiv.textContent = text
		}
		this.disposeEditor()
	}

	onKeydown(event: KeyboardEvent) {
		event.stopPropagation()

		if (event.code === "Enter") {
			// @ts-expect-error
			this.contentDiv.blur()
		}
	}
}
