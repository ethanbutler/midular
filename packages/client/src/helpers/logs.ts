type AnyFunction = (...args: any) => any;

export const loggable =
  <T extends AnyFunction>(fn: T, symbol: string) =>
  (...args: Parameters<T>) => {
    console.log(symbol, ...args);
    return fn(...args);
  };

export const makeLoggable =
  <T extends AnyFunction>(symbol: string) =>
  (fn: T) =>
    loggable(fn, symbol);

export const midiLoggable = makeLoggable("🎹");
