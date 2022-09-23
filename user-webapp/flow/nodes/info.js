import { FlowViewNode } from "flow-view";

export class FlowViewNodeInfo extends FlowViewNode {
  static type = "info";

  static style = {
    textarea: {
      border: "0",
      "font-size": "16px",
      outline: "none",
      padding: "4px 17px",
    },
    "textarea::selection": { "background-color": "transparent" },
  };

  static minNumCols = 5;
  static minNumRows = 1;

  setNumCols() {
    const numCols = this.textarea.value
      .split("\n")
      .reduce((max, line) => Math.max(max, line.length), 0);
    this.textarea.cols = Math.max(FlowViewNodeInfo.minNumCols, numCols);
  }

  setNumRows() {
    const numRows = this.textarea.value.split("\n").length;
    this.textarea.rows = Math.max(FlowViewNodeInfo.minNumRows, numRows);
  }

  initContent() {
    const textarea = this.createElement("textarea");
    this.textarea = textarea;

    textarea.spellcheck = false;
    textarea.tabIndex = -1;
    textarea.value = this.text;
    textarea.wrap = "off";

    this.setNumRows();
    this.setNumCols();

    textarea.onblur = () => {
      if (this.text !== textarea.value) {
        this.text = textarea.value;
        this.view.host.viewChange({ updatedNode: this.toObject() });
      }
      this.view.deselectNode(this);
    };

    textarea.onpointerdown = (event) => {
      event.stopPropagation();
      this.view.selectNode(this);
    };

    textarea.onpointermove = (event) => {
      event.stopPropagation();
    };

    textarea.onkeydown = (event) => {
      event.stopPropagation();
      if (event.code === "Tab") event.preventDefault();
      if (event.code === "Escape") textarea.blur();
    };

    textarea.onkeyup = (event) => {
      event.stopPropagation();
      this.setNumRows();
      this.setNumCols();
    };
  }
}
