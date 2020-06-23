
type IAsyncCallbackNoArgs = () => Promise<void>;

let running = false;

/**
 *
 * @param cb
 * @param interval
 */
const runAsyncInterval = async (cb: IAsyncCallbackNoArgs, interval: number) => {
  await cb();

  if (running) {
    setTimeout(() => runAsyncInterval(cb, interval), interval);
  }
};

/**
 *
 */
export const clearAsyncInterval = () => {
  running = false;
};

/**
 *
 * @param cb
 * @param interval
 */
export const setAsyncInterval = (cb: IAsyncCallbackNoArgs, interval: number) => {
  running = true;
  runAsyncInterval(cb, interval);
};
