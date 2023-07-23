export class UseActionAbortController extends AbortController {
  timeoutId = 0;

  constructor() {
    super();

    this.timeoutId = window.setTimeout(() => {
      this.abort();
    }, 10000);

    this.signal.addEventListener("abort", () => {
      this.clearTimeout();
    });
  }

  clearTimeout() {
    window.clearTimeout(this.timeoutId);
  }
}
