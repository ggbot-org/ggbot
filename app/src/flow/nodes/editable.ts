import { FlowViewNode } from "flow-view";

export class FlowViewNodeEditable extends FlowViewNode {
  isEditing: boolean | undefined;

  // @ts-ignore
  init(arg) {
    // @ts-ignore
    super.init(arg);

    // @ts-ignore
    this.contentDiv.style.outline = "none";

    // @ts-ignore
    this._onDblclick = this.onDblclick.bind(this);
    // @ts-ignore
    this.element.addEventListener("dblclick", this._onDblclick);
  }

  dispose() {
    // @ts-ignore
    this.element.removeEventListener("dblclick", this._onDblclick);
    this.disposeEditor();
    // @ts-ignore
    super.dispose();
  }

  disposeEditor() {
    if (!this.isEditing) return;

    // @ts-ignore
    this.contentDiv.removeAttribute("contenteditable");
    // @ts-ignore
    this.contentDiv.removeEventListener("blur", this._onBlur);
    // @ts-ignore
    this._onBlur = undefined;
    // @ts-ignore
    this.contentDiv.removeEventListener("keydown", this._onKeydown);
    // @ts-ignore
    this._onKeydown = undefined;

    this.isEditing = false;
  }

  onDblclick(event: MouseEvent) {
    event.stopPropagation();
    if (this.isEditing) return;

    // @ts-ignore
    const { contentDiv } = this;

    contentDiv.setAttribute("contenteditable", true);
    this.isEditing = true;

    // Move cursor to end of text
    const range = document.createRange();
    range.selectNodeContents(contentDiv);
    range.collapse(false);
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);

    // TODO use handleEvent()
    // TODO remove all ts-ignore

    // @ts-ignore
    this._onKeydown = this.onKeydown.bind(this);
    // @ts-ignore
    contentDiv.addEventListener("keydown", this._onKeydown);
    // @ts-ignore
    this._onBlur = this.onBlur.bind(this);
    // @ts-ignore
    contentDiv.addEventListener("blur", this._onBlur);

    contentDiv.focus();
  }

  onBlur(event: FocusEvent) {
    event.stopPropagation();
    const {
      // @ts-ignore
      contentDiv: { textContent },
      text,
    } = this;
    if (textContent && text !== textContent) {
      this.text = textContent;
      // @ts-ignore
      this.view.host.viewChange({ updatedNode: this.toObject() });
    } else {
      // @ts-ignore
      this.contentDiv.textContent = text;
    }
    this.disposeEditor();
  }

  onKeydown(event: KeyboardEvent) {
    event.stopPropagation();

    switch (event.code) {
      case "Enter":
        // @ts-ignore
        this.contentDiv.blur();
        break;
      default:
        break;
    }
  }
}
