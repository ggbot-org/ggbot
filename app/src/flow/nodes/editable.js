import { FlowViewNode } from "flow-view";

export class FlowViewNodeEditable extends FlowViewNode {
  init(arg) {
    super.init(arg);

    this.contentDiv.style.outline = "none";

    this._onDblclick = this.onDblclick.bind(this);
    this.element.addEventListener("dblclick", this._onDblclick);
  }

  dispose() {
    this.element.removeEventListener("dblclick", this._onDblclick);
    this.disposeEditor();
    super.dispose();
  }

  disposeEditor() {
    if (!this.isEditing) return;

    this.contentDiv.removeAttribute("contenteditable");
    this.contentDiv.removeEventListener("blur", this._onBlur);
    this._onBlur = undefined;
    this.contentDiv.removeEventListener("keydown", this._onKeydown);
    this._onKeydown = undefined;

    this.isEditing = false;
  }

  onDblclick(event) {
    event.stopPropagation();
    if (this.isEditing) return;

    const { contentDiv } = this;

    contentDiv.setAttribute("contenteditable", true);
    this.isEditing = true;

    // Move cursor to end of text
    const range = document.createRange();
    range.selectNodeContents(contentDiv);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // TODO use handleEvent()
    this._onKeydown = this.onKeydown.bind(this);
    contentDiv.addEventListener("keydown", this._onKeydown);
    this._onBlur = this.onBlur.bind(this);
    contentDiv.addEventListener("blur", this._onBlur);

    contentDiv.focus();
  }

  onBlur(event) {
    event.stopPropagation();
    const {
      contentDiv: { textContent },
      text,
    } = this;
    if (textContent && text !== textContent) {
      this.text = textContent;
      this.view.host.viewChange({ updatedNode: this.toObject() });
    } else {
      this.contentDiv.textContent = text;
    }
    this.disposeEditor();
  }

  onKeydown(event) {
    event.stopPropagation();

    switch (event.code) {
      case "Enter":
        this.contentDiv.blur();
        break;
      default:
        break;
    }
  }
}
