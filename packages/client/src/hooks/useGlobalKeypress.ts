import React from "react";

type ValueOf<T> = T[keyof T];

/**
 * Sets up a listener for keypress events, given
 * a mapping of keys and values.
 */
export function useGlobalKeypress<T>(
  map: T,
  initial: ValueOf<T>,
  cb?: (value: ValueOf<T>) => void
) {
  const [value, setValue] = React.useState<ValueOf<T>>(initial);

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Don't let user input trigger events.
      if (target.tagName === "INPUT") {
        return;
      }

      const key = e.key.toUpperCase();
      const mapKey = map[key as keyof T];
      if (mapKey) {
        setValue(mapKey);
        if (cb) cb(mapKey);
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [cb]);

  return value;
}
