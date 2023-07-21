import { Dispatch } from "react";

import {
  UseActionReducerActionAborted,
  UseActionReducerActionTimeout,
} from "./reducer.js";

export class UseActionAbortController extends AbortController {
  timeoutId = 0;

  clearTimeout() {
    window.clearTimeout(this.timeoutId);
  }

  setTimeout(
    dispatch: Dispatch<
      UseActionReducerActionAborted | UseActionReducerActionTimeout
    >
  ) {
    this.timeoutId = window.setTimeout(() => {
      this.abort();
      dispatch({
        type: "TIMEOUT",
      });
    }, 10000);

    this.signal.addEventListener("abort", () => {
      this.clearTimeout();
      dispatch({ type: "ABORTED" });
    });
  }
}
