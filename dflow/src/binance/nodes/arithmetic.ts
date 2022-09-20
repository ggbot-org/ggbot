import {DflowNode} from "dflow";
import {binanceAdd, binanceCoerceToDecimal, binanceDecimalToNumber} from "../arithmetic.js";

const {input, output} = DflowNode;

const binaryOperatorInputs = [input("number"), input("number")];

const binaryOperatorOutputs = [output("number")];

export class Addition extends DflowNode {
  static kind = "addition";
  static inputs = binaryOperatorInputs;
  static outputs = binaryOperatorOutputs;
  run() {
    const aNum = this.input(0).data as number;
    const bNum = this.input(1).data as number;
    const aDec = binanceCoerceToDecimal(aNum)
    const bDec = binanceCoerceToDecimal(bNum)
    const cDec = binanceAdd(aDec, bDec)
    const cNum = binanceDecimalToNumber(cDec)
    this.output(0).data = cNum
  }
}
