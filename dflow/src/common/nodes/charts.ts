import { DflowNode } from "dflow";

import {
  inputTime,
  inputOpen,
  inputHigh,
  inputLow,
  inputClose,
} from "./commonIO.js";

export class CandlesChart extends DflowNode {
  static kind = "candlesChart";
  static inputs = [inputTime, inputOpen, inputHigh, inputLow, inputClose];
  static outputs = [];
  run() {}
}
