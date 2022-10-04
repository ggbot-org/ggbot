import { DflowNode } from "dflow";

const { input, output } = DflowNode;

const inputArray = input("array", { name: "array" });
const inputElement = input([], { name: "element" });
const outputElement = output([], { name: "element" });
const outputRest = output("array", { name: "rest" });

export class Shift extends DflowNode {
  static kind = "shift";
  static inputs = [inputArray];
  static outputs = [outputElement, outputRest];
  run() {
    const array = (this.input(0).data as unknown[]).slice(0);
    this.output(0).data = array.shift();
    this.output(1).data = array;
  }
}

export class Pop extends DflowNode {
  static kind = "pop";
  static inputs = [inputArray];
  static outputs = [outputElement, outputRest];
  run() {
    const array = (this.input(0).data as unknown[]).slice(0);
    this.output(0).data = array.pop();
    this.output(1).data = array;
  }
}

export class Push extends DflowNode {
  static kind = "push";
  static inputs = [inputArray, inputElement];
  static outputs = [outputElement, outputRest];
  run() {
    const array = (this.input(0).data as unknown[]).slice(0);
    const element = this.input(1).data as unknown;
    array.push(element);
    this.output(0).data = array;
  }
}
